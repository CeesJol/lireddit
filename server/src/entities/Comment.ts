import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  text!: string;

  // @Field()
  // @Column({ type: "int", default: 0 })
  // points!: number;

  // @Field(() => Int, { nullable: true })
  // voteStatus: number | null; // 1 or -1 or null

  // @Field()
  // @Column()
  // posterId: number;

  // ---
  // @Field(() => [Post])
  // @ManyToOne(() => Post, (post) => post.comments)
  // post: Post;
  // ---

  // @OneToMany(() => Updoot, (updoot) => updoot.comment)
  // updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
