import { Context, Next } from "koa";
import AbstractException from "./AbstractException";
import handleException from "./HandleException";
import InternalServerError from "./InternalServerError";
import MethodNotAllowed from "./MethodNotAllowed";
import NotFound, { CODES } from "./NotFound";

const handler = async (ctx: Context, next: Next) => {
    await next();

    const ctxBody = ctx.body;
    if (ctxBody !== undefined) return;

    let exception: AbstractException;

    console.log(ctx.status, typeof ctx.status);

    switch(ctx.status) {
        case 404:
            exception = new NotFound({ code: CODES.PageNotFound });
            break;
        case 405:
            exception = new MethodNotAllowed({
                method: ctx.method, 
                allow: ctx.response.header['allow']?.toString().split(', ') ?? [] 
            });
            break;
        default: exception = new InternalServerError();
    }

    const { status, body, headers } = handleException(exception);
    ctx.status = status;
    ctx.body = body;
    if (headers !== null) ctx.set(headers);

    
}

export default handler;