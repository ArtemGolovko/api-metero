import { Context } from "koa";
import Router from "koa-router";
import User from "../Entity/User";
import { DI } from "../server";
import { createSchema, updateSchema } from "../Validator/Schema/UserSchema";
import type { TCreate, TUpdate } from "../Validator/Schema/UserSchema";
import validate from "../Validator/Validate";
import AbstractController from "./AbstractController";
import Unauthorized, { CODE } from "../Exception/Unauthorized";

export const format = (user: User) => ({
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    profileBanner: user.profileBanner,
    isPrivate: user.isPrivate,
    subscribers: user.subscribersCount,
    subs: user.subscribedCount
});

export default class UserController extends AbstractController {
    private async createUser(ctx: Context) {
        const body = await this.json();
        const validated = validate<TCreate>(createSchema, body);

        const user = DI.em.create(User, {
            username: validated.username,
            name: validated.name,
            profileBanner: validated.profileBanner,
            avatar: validated.avatar,
            isPrivate: validated.isPrivate
        });

        await DI.em.persistAndFlush(user);

        ctx.status = 201;
    }

    private async getUsers(ctx: Context) {
        const users = await DI.userRepository.findAllWithJoins();

        ctx.status = 200;
        ctx.body = users.map(format);
    }

    private async getUser(ctx: Context) {
        const user = await DI.userRepository.findOneWithJoins(ctx.params.username);

        ctx.status = 200;
        ctx.body = format(user);
    }

    private async updateUser(ctx: Context) {
        const body = await this.json();
        const validated = validate<TUpdate>(updateSchema, body);

        await DI.userRepository.update(ctx.params.username, validated);

        ctx.status = 200;
    }

    private async userSubscribe(ctx: Context) {
        const loggedUserUsername = this.auth();
        const user = await DI.userRepository.findOneOrFail({
            username: ctx.params.username
        }).catch(() => this.createNotFound('user', ctx.params.username));

        const loggedUser = await DI.userRepository.findOneOrFail({
            username: loggedUserUsername
        }).catch(() => { throw new Unauthorized({ code: CODE.NotFound })});

        user.subscribers.add(loggedUser);

        await DI.userRepository.persistAndFlush(user);
        ctx.status = 200;
    }

    private async userUnsubscribe(ctx: Context) {
        const loggedUserUsername = this.auth();
        const user = await DI.userRepository.findOneOrFail({
            username: ctx.params.username
        }, {
            populate: ['subscribers']
        }).catch(() => this.createNotFound('user', ctx.params.username));

        const loggedUser = await DI.userRepository.findOneOrFail({
            username: loggedUserUsername
        }).catch(() => { throw new Unauthorized({ code: CODE.NotFound })});

            user.subscribers.remove(loggedUser);

            await DI.userRepository.persistAndFlush(user);
            ctx.status = 200;
    }

    private async deleteUser(ctx: Context) {
        await DI.userRepository.delete(ctx.params.username);
        ctx.status = 204;
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

        return router.routes();
    }

    public prefix(): string {
        return '/user';
    }
}