import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import { DI } from "../server";
import { createSchema } from "../Validator/Schema/ReplySchema";
import type { TCreate } from '../Validator/Schema/ReplySchema';
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";
import BadRequest, { CODE } from "../Exception/BadRequest";
import Reply from "../Entity/Reply";

const format = (reply: Reply) => {
    const output = {
        id: reply.id,
        text: reply.text,
        author: {
            username: reply.author.username,
            name: reply.author.name
        },
        likes: reply.likesCount
    };

    if (reply.to === null) return output;

    const replyTo = {
        username: reply.to.username,
        name: reply.to.name 
    };

    return { ...output, replyTo };
}

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

    private async getReplies(ctx: Context) {
        await DI.commentRepository.has(ctx.params.commentId);

        const replies = await DI.replyRepository.findAllByCommentId(ctx.params.commentId);

        ctx.body = replies.map(format);
        ctx.status = 200;
    }

    private async getReply(ctx: Context) {
        const reply = await DI.replyRepository.fillOneWithJoins(ctx.params.id);

        ctx.body = format(reply);
        ctx.status = 200;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('/comment/:commentId/replies', this.createMiddleware(this.createReply));
        router.get('/comment/:commentId/replies', this.createMiddleware(this.getReplies));
        router.get('/reply/:id', this.createMiddleware(this.getReply));

        return router.routes();
    }
}