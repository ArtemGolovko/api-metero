import { Context, Middleware, Next } from "koa";
import Router from "koa-router";
import parser from "co-body";
import handleException from "../Exception/HandleException";

export default abstract class AbstractController {

    private context: Context|null = null;

    protected createMiddleware(middleware: (ctx: Context) => Promise<unknown>): Middleware {
        type TThis = typeof this;

        return (async function(this: TThis, ctx: Context, next: Next) {
            this.context = ctx;
            try {
                await middleware.call(this, ctx);
            } catch(error) {
                const { status, body, headers } = handleException(error);
                ctx.status = status;
                ctx.body = body;
                if (headers !== null) ctx.set(headers);
            }
            await next();
        }).bind(this);
    }

    protected async json(): Promise<any> {
        if (this.context === null) throw new Error('No context');

        return await parser.json(this.context.req);
    }

    public prefix(): string {
        return '/';
    }
    public abstract routes(): Router.IMiddleware<any, {}>;
}