import { Context, Next } from "koa";
import AbstractException from "./AbstractException";
import handleException from "./HandleException";
import InternalServerError from "./InternalServerError";
import MethodNotAllowed from "./MethodNotAllowed";
import NotFound, { CODE } from "./NotFound";

const handler = async (ctx: Context, next: Next) => {
    await next();

    if (ctx.request.method.toLowerCase() === 'options') {
        ctx.status = 200;
        return;
    }

    const ctxBody = ctx.body;
    if (ctxBody !== undefined) return;

    let exception: AbstractException;

    switch(ctx.status) {
        case 404:
            exception = new NotFound({ code: CODE.PageNotFound });
            break;
        case 405:
            exception = new MethodNotAllowed({
                method: ctx.method, 
                allow: ctx.response.header['allow']?.toString().split(', ') ?? [] 
            });
            break;
        default: return;
    }

    const { status, body, headers } = handleException(exception);
    ctx.status = status;
    ctx.body = body;
    if (headers !== null) ctx.set(headers);

    
}

export default handler;