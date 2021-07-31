import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Comment } from "../entities/Comment";
import isAuth from "../middleware/isAuth";

@Resolver(Comment)
export class CommentResolver {
  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("text") text: string
    // @Ctx() { req }: MyContext
  ): Promise<Comment> {
    return Comment.create({
      text: text,
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
  async deleteComment(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Comment.delete({ id });
    return true;
  }
}
