import type { Next, Context } from "koa";

export const CORS = async (ctx: Context, next: Next) => {
    ctx.set({
        'Access-Control-Allow-Origin': ctx.request.header['origin'] ?? '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    });
    
    await next();
}