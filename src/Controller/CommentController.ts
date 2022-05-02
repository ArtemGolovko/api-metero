import Router, { IMiddleware } from "koa-router";
import AbstractController from "./AbstractController";

export default class CommentController extends AbstractController {

    public prefix(): string {
        return '';
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        return router.routes();
    }
}