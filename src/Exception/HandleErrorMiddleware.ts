import { Context, Next } from "koa";
import handleException from "./HandleException";
import convertKoaError from "./HandleKoaError";

const handler = async (ctx: Context, next: Next) => {
    try {
        await next();
        convertKoaError(ctx);
    } catch(error) {
        const { status, body, headers } = handleException(error);
        ctx.status = status;
        ctx.body = body;
        if (headers !== null) ctx.set(headers);
    }
}

export default handler;