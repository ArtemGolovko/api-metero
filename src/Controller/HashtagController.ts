import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import Hashtag from "../Entity/Hashtag";
import { DI } from "../server";
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

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.get('s', this.createMiddleware(this.getHashtags));

        return router.routes();
    }

    public prefix(): string {
        return '/hashtag';
    }
}