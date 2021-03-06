import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import { DI } from "../server";
import { createSchema, updateSchema } from "../Validator/Schema/ReplySchema";
import type { TCreate, TUpdate } from '../Validator/Schema/ReplySchema';
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";
import BadRequest, { CODE } from "../Exception/BadRequest";
import Reply from "../Entity/Reply";
import Forbidden from "../Exception/Forbidden";
import User from "../Entity/User";
import Conflict, { CODE as ConflictCODE } from "../Exception/Conflict";

const isLiked = (reply: Reply, user: User|null) => {
    if (user === null) return undefined;
    return reply.likes.contains(user);
}

const format = (reply: Reply, loggedUser: User|null = null) => {
    const output = {
        id: reply.id,
        text: reply.text,
        author: {
            username: reply.author.username,
            name: reply.author.name,
            avatar: reply.author.avatar,
            verified: !!reply.author.verified
        },
        likes: reply.likesCount,
        isLiked: isLiked(reply, loggedUser)
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
            comment: comment,
            to: null,
            likesCount: 0
        });

        if (body.replyTo !== undefined) {
            const userFor = await DI.userRepository.findOneOrFail(
                { username: body.replyTo }
            ).catch(() => { throw new BadRequest({ code: CODE.NotFound }) });
            reply.to = userFor;
        }

        await DI.em.persistAndFlush(reply);
        ctx.status = 201;
        ctx.body = format(reply, loggedUser);
    }

    private async getReplies(ctx: Context) {
        await DI.commentRepository.has(ctx.params.commentId);

        const replies = await DI.replyRepository.findAllByCommentId(ctx.params.commentId);

        const loggedUser = await this.tryUser();

        ctx.body = replies.map(reply => format(reply, loggedUser));
        ctx.status = 200;
    }

    private async getReply(ctx: Context) {
        const reply = await DI.replyRepository.findOneWithJoins(ctx.params.id);

        const loggedUser = await this.tryUser();

        ctx.body = format(reply, loggedUser);
        ctx.status = 200;
    }

    private async updateReply(ctx: Context) {
        const loggedUser = await this.user();

        const reply = await DI.replyRepository.findOneWithJoins(ctx.params.id);

        if (reply.author.username !== loggedUser.username) throw new Forbidden();

        const body = validate<TUpdate>(updateSchema, await this.json());

        reply.text = body.text;
        
        await DI.em.flush();
        ctx.status = 200;
        ctx.body = format(reply, loggedUser);
    }

    private async likeReply(ctx: Context) {
        const loggedUser = await this.user();
        const reply = await DI.replyRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['likes'] }
        ).catch(() => this.createNotFound('reply', ctx.params.id));

        if (reply.likes.contains(loggedUser))
            throw new Conflict({ code: ConflictCODE.AlreadyLiked });

        reply.likes.add(loggedUser);

        await DI.em.flush();
        ctx.status = 200;
        ctx.body = {
            likes: reply.likes.count(),
            isLiked: isLiked(reply, loggedUser)
        }
    }

    private async unlikeReply(ctx: Context) {
        const loggedUser = await this.user();
        const reply = await DI.replyRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['likes'] }
        ).catch(() => this.createNotFound('reply', ctx.params.id));

        if (!reply.likes.contains(loggedUser))
            throw new Conflict({ code: ConflictCODE.AlreadyLiked });

        reply.likes.remove(loggedUser);

        await DI.em.flush();
        ctx.status = 200;
        ctx.body = {
            likes: reply.likes.count(),
            isLiked: isLiked(reply, loggedUser)
        }
    }

    private async deleteReply(ctx: Context) {
        const loggedUserUsername = this.auth();
        const reply = await DI.replyRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['author'] }
        ).catch(() => this.createNotFound('reply', ctx.params.id));

        if (reply.author.username !== loggedUserUsername) throw new Forbidden();

        await DI.commentRepository.removeAndFlush(reply);
        ctx.status = 204;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('/comment/:commentId/replies', this.createMiddleware(this.createReply));
        router.get('/comment/:commentId/replies', this.createMiddleware(this.getReplies));
        router.get('/reply/:id', this.createMiddleware(this.getReply));
        router.put('/reply/:id', this.createMiddleware(this.updateReply));
        router.post('/reply/:id/like', this.createMiddleware(this.likeReply));
        router.post('/reply/:id/unlike', this.createMiddleware(this.unlikeReply));
        router.delete('/reply/:id', this.createMiddleware(this.deleteReply));

        return router.routes();
    }
}