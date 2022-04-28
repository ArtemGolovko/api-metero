import { Context, Middleware, Next } from "koa";
import Router from "koa-router";
import parser from "co-body";
import handleException from "../Exception/HandleException";
import Unauthorized, { CODE } from "../Exception/Unauthorized";
import NotFound, { CODE as NotFoundCODE } from "../Exception/NotFound";

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
                console.log(headers);
                if (headers !== null) ctx.set(headers);
            }
            await next();
        }).bind(this);
    }

    protected async json(): Promise<any> {
        if (this.context === null) throw new Error('No context');

        return await parser.json(this.context.req);
    }

    protected auth(): string|never {
        if (this.context === null) throw new Error('No context');

        if (this.context.headers['authorization'] === undefined) {
            throw new Unauthorized({ code: CODE.NoAuthorization });
        }
        const authorization: string[] = this.context.headers['authorization'].split(' ');
    
        if (authorization.length < 2) {
            throw new Unauthorized({ code: CODE.NoAuthorization });
        }
    
        if (authorization[0].toLowerCase() !== 'bearer') {
            throw new Unauthorized({ code: CODE.NoAuthorization });
        }
    
        return authorization[1];
    }

    protected createNotFound(resource: string, id: string): never {
        throw new NotFound({ code: NotFoundCODE.RosourceNotFound, resource: resource, id: id });
    }

    public prefix(): string {
        return '/';
    }
    
    public abstract routes(): Router.IMiddleware<any, {}>;
}