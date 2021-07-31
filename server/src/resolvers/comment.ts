import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Comment } from "../entities/Comment";
import isAuth from "../middleware/isAuth";

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creatorId);
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    return Comment.create({
      text: text,
      creatorId: req.session.userId,
    }).save();
  }

  @Query(() => [Comment])
  async comments(): Promise<Comment[]> {
    // return Comment.find();
    const result = (await getConnection()
      .createQueryBuilder()
      .select("*")
      .from("comment", "c")
      .orderBy(`"createdAt"`, "DESC")
      .execute()) as any;
    console.log("result:", result);
    return result;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Comment.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
