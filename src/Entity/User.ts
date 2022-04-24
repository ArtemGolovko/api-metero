import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property, types } from "@mikro-orm/core"
import Comment from "./Comment"
import Post from "./Post"
import Reply from "./Reply"

@Entity()
export default class User {
    @PrimaryKey({ type: types.string, autoincrement: false })
    username!: string

    @Property({ type: types.string })
    name!: string

    @Property({ type: types.string })
    avatar!: string

    @Property({ type: types.string })
    profileBanner!: string

    @Property({ type: types.boolean })
    isPrivate: boolean = false

    @ManyToMany(() => User, 'subscribed', { owner: true })
    subscribers = new Collection<User>(this);

    @ManyToMany(() => User, user => user.subscribers)
    subscribed = new Collection<User>(this);

    @OneToMany(() => Post, post => post.author)
    posts = new Collection<Post>(this);

    @ManyToMany(() => Post, post => post.likes)
    postsLiked = new Collection<Post>(this);

    @ManyToMany(() => Post, post => post.markedUsers)
    markedInPost = new Collection<Post>(this);

    @OneToMany(() => Comment, comment => comment.author)
    comments = new Collection<Comment>(this);

    @ManyToMany(() => Comment, comment => comment.likes)
    commentsLiked = new Collection<Comment>(this);

    @OneToMany(() => Reply, reply => reply.author)
    replies = new Collection<Reply>(this);

    @OneToMany(() => Reply, reply => reply.to)
    repliesFor = new Collection<Reply>(this);

    @ManyToMany(() => Reply, reply => reply.likes)
    repiesLiked = new Collection<Reply>(this);
}