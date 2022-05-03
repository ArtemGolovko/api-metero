import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import { CODE } from "../Exception/Unauthorized";
import { DI } from "../server";
import type { TCreate } from "../Validator/Schema/CommentSchema";
import { createSchema } from "../Validator/Schema/CommentSchema";
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";

export default class CommentController extends AbstractController {

    public async createComment(ctx: Context) {
        const loggedUser = await DI.userRepository.findOneOrFail(
            { username: this.auth() }
        ).catch(() => this.createUnauthorized(CODE.NotFound));
        
        const post = await DI.postRepository.findOneOrFail(
            { id: ctx.params.postId }
        ).catch(() => this.createNotFound('post', ctx.params.postId));

        const body = validate<TCreate>(createSchema, await this.json());

        const comment = DI.commentRepository.create({
            author: loggedUser,
            text: body.text,
            post: post
        });

        await DI.em.persistAndFlush(comment);
        ctx.status = 201;
    }

    private async getComments(ctx: Context) {
        await DI.postRepository.has(ctx.params.postId);

        const comments = await DI.commentRepository.findAllByPostId(ctx.params.postId);
        // console.log(comments);

        ctx.status = 200;
    } 

    private async getCommnet(ctx: Context) {
        const comment = await DI.commentRepository.findOneWithJoins(ctx.params.id);

        console.log(comment);

        ctx.status = 200;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('/post/:postId/comments', this.createMiddleware(this.createComment));
        router.get('/post/:postId/comments', this.createMiddleware(this.getComments));
        router.get('/comment/:id', this.createMiddleware(this.getCommnet));

        return router.routes();
    }
}