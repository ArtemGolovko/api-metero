import { Collection, Entity, ManyToMany, PrimaryKey, Property, types } from "@mikro-orm/core";
import Post from "./Post";

@Entity()
export default class Hashtag {
    @PrimaryKey({ type: types.integer, autoincrement: true })
    id!: number

    @Property({ type: types.string, unique: true })
    name!: string

    @ManyToMany(() => Post, post => post.hashtags)
    associatedPosts = new Collection<Post>(this);
}