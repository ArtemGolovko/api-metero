import Router, { IMiddleware } from "koa-router";
import AbstractController from "./AbstractController";

export default class HashtagController extends AbstractController {
    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        return router.routes();
    }

    public prefix(): string {
        return '/hashtag';
    }
}