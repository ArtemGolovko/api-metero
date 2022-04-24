import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property, types } from "@mikro-orm/core";
import Comment from "./Comment";
import User from "./User";

@Entity()
export default class Reply {
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
}