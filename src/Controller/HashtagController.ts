import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import Hashtag from "../Entity/Hashtag";
import { DI } from "../server";
import { format as postFormat } from './PostController';
import AbstractController from "./AbstractController";

const format = (hashtag: Hashtag) => ({
    id: hashtag.id,
    name: hashtag.name,
    posts: hashtag.associatedPostsCount
})

export default class HashtagController extends AbstractController {
    private async getHashtags(ctx: Context) {
        const hashtags = await DI.hashtagRepository.findAllWithJoins();

        ctx.body = hashtags.map(format);
        ctx.status = 200;
    }

    private async getHashtag(ctx: Context) {
        const hashtag = await DI.hashtagRepository.findOneWithJoins(ctx.params.id);

        ctx.body = format(hashtag);
        ctx.status = 200;
    }

    private async getHashtagPosts(ctx: Context) {
        await DI.hashtagRepository.has(ctx.params.id);

        const posts = await DI.postRepository.findAllbyHashtagId(ctx.params.id);

        const loggedUser = await this.tryUser();

        ctx.body = posts.map(post => postFormat(post, loggedUser !== null ? loggedUser : undefined));
        ctx.status = 200;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.get('s', this.createMiddleware(this.getHashtags));
        router.get('/:id', this.createMiddleware(this.getHashtag));
        router.get('/:id/posts', this.createMiddleware(this.getHashtagPosts));

        return router.routes();
    }

    public prefix(): string {
        return '/hashtag';
    }
}