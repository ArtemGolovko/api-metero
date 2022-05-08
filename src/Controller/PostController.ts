import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import { DI } from "../server";
import validate from "../Validator/Validate";
import { createSchema, updateSchema } from "../Validator/Schema/PostSchema";
import type { TCreate, TUpdate } from '../Validator/Schema/PostSchema';
import AbstractController from "./AbstractController";
import Hashtag from "../Entity/Hashtag";
import Post from "../Entity/Post";
import Forbidden from "../Exception/Forbidden";
import moment from "moment";
import User from "../Entity/User";

const createDiff = (date: Date|null|undefined) => {
    if (date === undefined) return undefined;
    if (date === null) return undefined;

    return moment(date.getTime()).locale('ru').fromNow()
}

const isLiked = (post: Post, user: User|null) => {
    if (user === null) return undefined;
    return post.likes.contains(user);
}

export const format = (post: Post, loggedUser: User|null = null) => ({
    id: post.id,
    author: {
        username: post.author.username,
        name: post.author.name,
        avatar: post.author.avatar
    },
    date: post.createdAt.getTime(),
    dateDiff: createDiff(post.createdAt),
    dateUpdated: post.updatedAt?.getTime(),
    dateUpdatedDiff: createDiff(post.updatedAt),
    text: post.text,
    hashtags: post.hashtags.getItems().map(hashtag => hashtag.name),
    profileMarks: post.markedUsers.getItems().map(user => user.username),
    images: post.images,
    likes: post.likesCount,
    isLiked: isLiked(post, loggedUser)
})

export default class PostController extends AbstractController {
    private async createPost(ctx: Context) {
        const user = await this.user();

        const body = validate<TCreate>(createSchema, await this.json());
        const post = DI.postRepository.create({
            author: user,
            createdAt: new Date(),
            images: body.images,
            text: body.text
        })

        post.hashtags.set(await this.hashtags(body.hashtags));

        post.markedUsers.set(await this.markedUsers(body.profileMarks));

        await DI.em.persistAndFlush(post);

        ctx.status = 201;
    }

    private async getPosts(ctx: Context) {
        const posts = await DI.postRepository.findAllWithJoins();

        const loggedUser = await this.tryUser();

        ctx.body = posts.map(post => format(post, loggedUser));
        ctx.status = 200;
    }

    private async getPost(ctx: Context) {
        const post = await DI.postRepository.findOneWithJoins(ctx.params.id);

        const loggedUser = await this.tryUser();

        ctx.body = format(post, loggedUser);
        ctx.status = 200;
    }

    private async updatePost(ctx: Context) {
        const loggedUserUsername = this.auth();

        const body = validate<TUpdate>(updateSchema, await this.json());

        const populate = ['author'];
        if (body.profileMarks !== undefined) populate.push('markedUsers');
        if (body.hashtags !== undefined) populate.push('hashtags');

        const post = await DI.postRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: populate as any }
        ).catch(() => this.createNotFound('post', ctx.params.id));

        if (post.author.username !== loggedUserUsername) throw new Forbidden();

        post.updatedAt = new Date();

        if (body.text !== undefined) post.text = body.text;

        if (body.hashtags !== undefined) {
            post.hashtags.removeAll();
            post.hashtags.set(await this.hashtags(body.hashtags));
        }

        if (body.profileMarks !== undefined) {
            post.hashtags.removeAll();
            post.markedUsers.set(await this.markedUsers(body.profileMarks));
        }

        if (body.images !== undefined) post.images = body.images;

        await DI.em.flush();
        ctx.status = 200;
    }

    private async likePost(ctx: Context) {
        const loggedUser = await this.user();

        const post = await DI.postRepository.findOneOrFail(
            { id: ctx.params.id }
        ).catch(() => this.createNotFound('post', ctx.params.id));

        post.likes.add(loggedUser);

        await DI.em.flush();
        ctx.status = 200;
    }

    private async unlikePost(ctx: Context) {
        const loggedUser = await this.user();

        const post = await DI.postRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['likes'] }
        ).catch(() => this.createNotFound('post', ctx.params.id));

        post.likes.remove(loggedUser);

        await DI.em.flush();
        ctx.status = 200;
    }

    private async deletePost(ctx: Context) {
        const loggedUserUsername = this.auth();

        const post = await DI.postRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['author'] }
        ).catch(() => this.createNotFound('post', ctx.params.id));

        if (post.author.username !== loggedUserUsername) throw new Forbidden();

        await DI.em.removeAndFlush(post);
        ctx.status = 204;
    }

    private async hashtags(names: string[]): Promise<Hashtag[]> {
        const hashtags = await DI.hashtagRepository.find(
            { name: names }
        );

        const foundHashtags = hashtags.map(hashtag => hashtag.name);

        const newHashtags = names.filter(hashtag => !foundHashtags.includes(hashtag));

        if (newHashtags.length !== 0) {
            await DI.hashtagRepository.createMany(newHashtags);

            return await DI.hashtagRepository.find(
                { name: names }
            );
        }

        return hashtags;
    }

    private async markedUsers(usernames: string[]) {
        return await DI.userRepository.find(
            { username: usernames }
        );
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('s', this.createMiddleware(this.createPost));
        router.get('s', this.createMiddleware(this.getPosts));
        router.get('/:id', this.createMiddleware(this.getPost));
        router.put('/:id', this.createMiddleware(this.updatePost));
        router.post('/:id/like', this.createMiddleware(this.likePost));
        router.post('/:id/unlike', this.createMiddleware(this.unlikePost));
        router.delete('/:id', this.createMiddleware(this.deletePost));

        return router.routes();
    }
    
    public prefix(): string {
        return '/post';
    }
}