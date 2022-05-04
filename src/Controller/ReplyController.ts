import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import { DI } from "../server";
import { createSchema } from "../Validator/Schema/ReplySchema";
import type { TCreate } from '../Validator/Schema/ReplySchema';
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";
import BadRequest, { CODE } from "../Exception/BadRequest";

export default class ReplyController extends AbstractController {
    private async createReply(ctx: Context) {
        const loggedUser = await this.user();
        const comment = await DI.commentRepository.findOneOrFail(
            { id: ctx.params.commentId },
        ).catch(() => this.createNotFound('comment', ctx.params.commentId));

        const body = validate<TCreate>(createSchema, await this.json());

        const reply = DI.replyRepository.create({
            text: body.text,
            author: loggedUser,
            comment: comment
        });

        if (body.replyTo !== undefined) {
            const userFor = await DI.userRepository.findOneOrFail(
                { username: body.replyTo }
            ).catch(() => { throw new BadRequest({ code: CODE.NotFound }) });
            reply.to = userFor;
        }

        await DI.em.persistAndFlush(reply);
        ctx.status = 201;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('/comment/:commentId/replies', this.createMiddleware(this.createReply));

        return router.routes();
    }
}