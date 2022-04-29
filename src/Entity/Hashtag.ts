import { Collection, Entity, EntityRepositoryType, ManyToMany, PrimaryKey, Property, types } from "@mikro-orm/core";
import HashtagRepository from "../Repository/HashtagRepository";
import Post from "./Post";

@Entity()
export default class Hashtag {
    [EntityRepositoryType]?: HashtagRepository

    @PrimaryKey({ type: types.integer, autoincrement: true })
    id!: number

    @Property({ type: types.string, unique: true })
    name!: string

    @ManyToMany(() => Post, post => post.hashtags)
    associatedPosts = new Collection<Post>(this);
}