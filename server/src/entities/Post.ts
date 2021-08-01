import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Updoot } from "./Updoot";
import { User } from "./User";
import { Comment } from "./Comment";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 or -1 or null

  @Field()
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  creator: User;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  // ---
  // @Field(() => Comment)
  // @OneToMany(() => Comment, (comment) => comment.post)
  // comments: Comment[];
  // ---

  // ---- RELATION TO COMMENT -----
  @OneToMany(() => Comment, (comment) => comment.relatedPost)
  comments: Comment[];

  // ---- MISC -----
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
