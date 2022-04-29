import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, types } from "@mikro-orm/core";
import Hashtag from "./Hashtag";
import User from "./User";
import Comment from './Comment';
import PostRepository from "../Repository/PostRepository";

@Entity({ customRepository: () => PostRepository })
export default class Post {
    [EntityRepositoryType]?: PostRepository

    @PrimaryKey({ type: types.integer, autoincrement: true })
    id!: number

    @Property({ type: types.datetime })
    createdAt!: Date

    @Property({ type: types.datetime, nullable: true })
    updatedAt: Date|null = null

    @Property({ type: types.text })
    text!: string

    @Property({ type: types.array })
    images!: string[]

    @ManyToOne(() => User)
    author!: User

    @ManyToMany(() => User, 'postsLiked', { owner: true })
    likes = new Collection<User>(this);

    @ManyToMany(() => User, 'markedInPost', { owner: true })
    markedUsers = new Collection<User>(this);

    @ManyToMany(() => Hashtag, 'associatedPosts', { owner: true })
    hashtags = new Collection<Hashtag>(this);

    @OneToMany(() => Comment, comment => comment.post)
    comments = new Collection<Comment>(this);

    @Property({ persist: false })
    likesCount?: number
}