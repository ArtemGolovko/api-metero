import { Context } from "koa";
import Router from "koa-router";
import { User } from "../Entity/User";
import { DI } from "../server";
import AbstractController from "./AbstractController";

export default class UserController extends AbstractController {
    private async createUser(ctx: Context) {
        const body = await this.json();
        const user = DI.em.create(User, {
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
        });

        await DI.em.persistAndFlush(user);

        ctx.status = 201;
    }

    private async getUsers(ctx: Context) {
        const users = await DI.em.find(User, {}, { limit: 10 });

        ctx.status = 200;
        ctx.body = users;
    }

    private async getUser(ctx: Context) {
        const user = await DI.em.findOneOrFail(User, ctx.params.username);

        ctx.status = 200;
        ctx.body = user;
    }

    private async updateUser(ctx: Context) {
        const user = await DI.em.findOneOrFail(User, ctx.params.username);
        const body = await this.json();

        if ('firstName' in body) {
            user.firstName = body.firstName;
        }
        
        if ('lastName' in body) {
            user.lastName = body.lastName;
        }

        await DI.em.flush()

        ctx.status = 200;
    }

    private async deleteUser(ctx: Context) {
        const user = await DI.em.findOneOrFail(User, ctx.params.username);

        await DI.em.removeAndFlush(user);
        ctx.status = 204;
    }

    public routes(): Router.IMiddleware<any, {}> {
        const router = new Router();

        router.post('s', this.createMiddleware(this.createUser));
        router.get('s', this.createMiddleware(this.getUsers));
        router.get('/:username', this.createMiddleware(this.getUser));
        router.put('/:username', this.createMiddleware(this.updateUser));
        router.delete('/:username', this.createMiddleware(this.deleteUser));

        return router.routes();
    }

    public prefix(): string {
        return '/user';
    }
}