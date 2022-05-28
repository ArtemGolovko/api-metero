import { Context } from "koa";
import Router from "koa-router";
import User from "../Entity/User";
import { DI } from "../server";
import { createSchema, updateSchema } from "../Validator/Schema/UserSchema";
import type { TCreate, TUpdate } from "../Validator/Schema/UserSchema";
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";
import { format as postFormat } from './PostController';
import Conflict, { CODE } from "../Exception/Conflict";
import { wrap } from "@mikro-orm/core";

const isSubscribed = (user: User, loggedUser: User|null) => {
    if (loggedUser == null) return undefined;
    if (loggedUser.username === user.username) return undefined;

    DI.logger.debug(
        'Debug isSubscribed. User: ' +
        JSON.stringify(user) + '. Logged user: ' +
        JSON.stringify(loggedUser) + '. User subscribers' +
        JSON.stringify(user.subscribers.getIdentifiers())
    );

    return user.subscribers.contains(loggedUser);
}

const format = (user: User, loggedUser: User|null = null) => ({
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    profileBanner: user.profileBanner,
    description: user.description,
    isPrivate: !!user.isPrivate,
    verified: !!user.verified,
    subscribers: user.subscribersCount,
    subs: user.subscribedCount,
    isSubscribed: isSubscribed(user, loggedUser)
});

export default class UserController extends AbstractController {
    private async createUser(ctx: Context) {
        const body = validate<TCreate>(createSchema, await this.json());

        const user = DI.em.create(User, {
            username: body.username,
            name: body.name,
            profileBanner: body.profileBanner,
            avatar: body.avatar,
            isPrivate: body.isPrivate,
            description: body.description,
            verified: false,
            subscribersCount: 0,
            subscribedCount: 0
        });

        await DI.em.persistAndFlush(user);

        ctx.status = 201;
        ctx.body = format(user);
    }

    private async getUsers(ctx: Context) {
        const users = await DI.userRepository.findAllWithJoins();

        const loggedUser = await this.tryUser();

        ctx.status = 200;
        ctx.body = users.map(user => format(user, loggedUser));
    }

    private async getUser(ctx: Context) {
        const user = await DI.userRepository.findOneWithJoins(ctx.params.username);

        const loggedUser = await this.tryUser();

        ctx.status = 200;
        ctx.body = format(user, loggedUser);
    }

    private async updateUser(ctx: Context) {
        const user = await DI.userRepository.findOneWithJoins(ctx.params.username);
        const body = validate<TUpdate>(updateSchema, await this.json());

        wrap(user).assign(body);
        await DI.em.flush();

        ctx.status = 200;
        ctx.body = format(user);
    }

    private async userSubscribe(ctx: Context) {
        const loggedUser = await this.user();

        const user = await DI.userRepository.findOneOrFail(
            { username: ctx.params.username },
            { populate: ['subscribers'] }
        ).catch(() => this.createNotFound('user', ctx.params.username));

        if (user.username === loggedUser.username)
            throw new Conflict({ code: CODE.CannotSubscribe });

        if (user.subscribers.contains(loggedUser))
            throw new Conflict({ code: CODE.AlreadySubscribed });

        user.subscribers.add(loggedUser);

        await DI.userRepository.persistAndFlush(user);
        ctx.status = 200;
    }

    private async userUnsubscribe(ctx: Context) {
        const loggedUser = await this.user();

        const user = await DI.userRepository.findOneOrFail(
            { username: ctx.params.username },
            { populate: ['subscribers'] }
        ).catch(() => this.createNotFound('user', ctx.params.username));

        if (user.username === loggedUser.username)
            throw new Conflict({ code: CODE.CannotUnsubscribe });

        if (!user.subscribers.contains(loggedUser))
            throw new Conflict({ code: CODE.AlreadyUnsubscribed });

        user.subscribers.remove(loggedUser);

        await DI.userRepository.persistAndFlush(user);
        ctx.status = 200;
    }

    private async deleteUser(ctx: Context) {
        await DI.userRepository.delete(ctx.params.username);
        ctx.status = 204;
    }

    private async getPosts(ctx: Context) {
        await DI.userRepository.has(ctx.params.username);

        const posts = await DI.postRepository.findAllByAuthorUsername(ctx.params.username);

        const loggedUser = await this.tryUser();

        ctx.body = posts.map(post => postFormat(post, loggedUser));
        ctx.status = 200;
    }

    private async getUserSubscribers(ctx: Context) {
        await DI.userRepository.has(ctx.params.username);

        const users = await DI.userRepository.findAllBySubscribedUsername(ctx.params.username);

        const loggedUser = await this.tryUser();
        ctx.body = users.map(user => format(user, loggedUser));
        ctx.status = 200;
    }

    private async getUserSubscribed(ctx: Context) {
        await DI.userRepository.has(ctx.params.username);

        const users = await DI.userRepository.findAllBySubscribersUsername(ctx.params.username);

        const loggedUser = await this.tryUser();
        ctx.body = users.map(user => format(user, loggedUser));
        ctx.status = 200;
    }

    public routes(): Router.IMiddleware<any, {}> {
        const router = new Router();

        router.post('s', this.createMiddleware(this.createUser));
        router.get('s', this.createMiddleware(this.getUsers));
        router.get('/:username', this.createMiddleware(this.getUser));
        router.put('/:username', this.createMiddleware(this.updateUser));
        router.post('/:username/subscribe', this.createMiddleware(this.userSubscribe));
        router.post('/:username/unsubscribe', this.createMiddleware(this.userUnsubscribe));
        router.delete('/:username', this.createMiddleware(this.deleteUser));
        router.get('/:username/posts', this.createMiddleware(this.getPosts));
        router.get('/:username/subscribers', this.createMiddleware(this.getUserSubscribers));
        router.get('/:username/subs', this.createMiddleware(this.getUserSubscribed));

        return router.routes();
    }

    public prefix(): string {
        return '/user';
    }
}