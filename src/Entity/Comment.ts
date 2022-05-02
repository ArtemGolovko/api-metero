import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, types } from "@mikro-orm/core";
import CommentRepository from "../Repository/CommentRepository";
import Post from "./Post";
import Reply from "./Reply";
import User from "./User";

@Entity({ customRepository: () => CommentRepository })
export default class Comment {
    [EntityRepositoryType]?: CommentRepository

    @PrimaryKey({ type: types.integer, autoincrement: true })
    id!: number

    @Property({ type: types.text })
    text!: string

    @ManyToOne(() => User)
    author!: User

    @ManyToOne(() => Post)
    post!: Post

    @ManyToMany(() => User, 'commentsLiked', { owner: true })
    likes = new Collection<User>(this);

    @OneToMany(() => Reply, reply => reply.comment)
    replies = new Collection<Reply>(this);

    @Property({ persist: false })
    likesCount?: number
}