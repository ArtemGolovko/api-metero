import { Collection, Entity, EntityManagerType, ManyToMany, ManyToOne, PrimaryKey, Property, types } from "@mikro-orm/core";
import ReplyRepository from "../Repository/ReplyRepository";
import Comment from "./Comment";
import User from "./User";

@Entity({ customRepository: () => ReplyRepository })
export default class Reply {
    [EntityManagerType]?: ReplyRepository

    @PrimaryKey({ type: types.integer, autoincrement: true })
    id!: number

    @Property({ type: types.text })
    text!: string

    @ManyToOne(() => User)
    author!: User

    @ManyToOne(() => Comment)
    comment!: Comment

    @ManyToOne(() => User, { nullable: true })
    to!: User|null

    @ManyToMany(() => User, 'repiesLiked', { owner: true })
    likes = new Collection<User>(this);

    @Property({ persist: false })
    likesCount?: number
}