import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import { DI } from "../server";
import { TCreate, TUpdate, updateSchema } from "../Validator/Schema/CommentSchema";
import { createSchema } from "../Validator/Schema/CommentSchema";
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";
import Comment from "../Entity/Comment";
import Forbidden from "../Exception/Forbidden";
import User from "../Entity/User";
import Conflict, { CODE } from "../Exception/Conflict";

const isLiked = (comment: Comment, user: User|null) => {
    if (user === null) return undefined;
    return comment.likes.contains(user);
}

const format = (comment: Comment, loggedUser: User|null = null) => ({
    id: comment.id,
    text: comment.text,
    author: {
        username: comment.author.username,
        name: comment.author.name,
        avatar: comment.author.avatar,
        verified: !!comment.author.verified
    },
    likes: comment.likesCount,
    isLiked: isLiked(comment, loggedUser)
})

export default class CommentController extends AbstractController {

    public async createComment(ctx: Context) {
        const loggedUser = await this.user();
        
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

        const loggedUser = await this.tryUser();

        ctx.body = comments.map(comment => format(comment, loggedUser));
        ctx.status = 200;
    } 

    private async getCommnet(ctx: Context) {
        const comment = await DI.commentRepository.findOneWithJoins(ctx.params.id);

        const loggedUser = await this.tryUser();

        ctx.body = format(comment, loggedUser);
        ctx.status = 200;
    }

    private async updateComment(ctx: Context) {
        const loggedUserUsername = this.auth();
        const comment = await DI.commentRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['author'] }
        ).catch(() => this.createNotFound('comment', ctx.params.id));

        if (comment.author.username !== loggedUserUsername) throw new Forbidden();

        const body = validate<TUpdate>(updateSchema, await this.json());

        comment.text = body.text;

        await DI.em.flush();
        ctx.status = 200;
    }

    private async likeComment(ctx: Context) {
        const loggedUser = await this.user();
        const comment = await DI.commentRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['likes']}
        ).catch(() => this.createNotFound('comment', ctx.params.id));

        if (comment.likes.contains(loggedUser))
            throw new Conflict({ code: CODE.AlreadyLiked });

        comment.likes.add(loggedUser);

        await DI.em.flush();
        ctx.status = 200;
    }

    private async unlikeComment(ctx: Context) {
        const loggedUser = await this.user();
        const comment = await DI.commentRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['likes'] }
        ).catch(() => this.createNotFound('comment', ctx.params.id));

        if (!comment.likes.contains(loggedUser))
            throw new Conflict({ code: CODE.AlreadyUnliked });

        comment.likes.remove(loggedUser);

        await DI.em.flush();
        ctx.status = 200;
    }

    private async deleteComment(ctx: Context) {
        const loggedUserUsername = this.auth();
        const comment = await DI.commentRepository.findOneOrFail(
            { id: ctx.params.id },
            { populate: ['author'] }
        ).catch(() => this.createNotFound('comment', ctx.params.id));

        if (comment.author.username !== loggedUserUsername) throw new Forbidden();

        await DI.em.removeAndFlush(comment);
        ctx.status = 204;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('/post/:postId/comments', this.createMiddleware(this.createComment));
        router.get('/post/:postId/comments', this.createMiddleware(this.getComments));
        router.get('/comment/:id', this.createMiddleware(this.getCommnet));
        router.put('/comment/:id', this.createMiddleware(this.updateComment));
        router.post('/comment/:id/like', this.createMiddleware(this.likeComment));
        router.post('/comment/:id/unlike', this.createMiddleware(this.unlikeComment));
        router.delete('/comment/:id', this.createMiddleware(this.deleteComment));

        return router.routes();
    }
}