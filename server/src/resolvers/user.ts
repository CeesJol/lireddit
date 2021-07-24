import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { MyContext } from "../types";
import { User } from "../entities/User";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";
import { validateRegister } from "../util/validateRegister";
import { UsernamePasswordInput } from "./UsernamePasswordInput";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // @Mutation(() => Boolean)
  // async forgotPassword(@Arg("email") email: string, @Ctx() { em }: MyContext) {
  //   const user = await em.findOne(User, { email });
  //   console.log(user);
  //   return true;
  // }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    console.log(req.session);

    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
      console.log("user:", user);
    } catch (err) {
      console.log("err:", err);
      // || err.detail.includes("already exists")) {
      if (err.code === "23505") {
        // duplicate username error
        return {
          errors: [
            {
              field: "username",
              message: "The username has already been taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : {
            username: usernameOrEmail,
          }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "That username does not exist.",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password." }],
      };
    }

    req.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        return resolve(true);
      })
    );
  }

  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }
}
