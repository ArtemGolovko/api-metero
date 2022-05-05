import type { Next, Context } from "koa";

export const CORSandCSP = async (ctx: Context, next: Next) => {
    ctx.set({
        'Access-Control-Allow-Origin': ctx.request.header['origin'] ?? '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Content-Security-Policy': 'default-src ' + (ctx.request.header['origin'] ?? '*')
    });
    
    await next();
}