import { Context } from "koa"
import MethodNotAllowed from "./MethodNotAllowed";
import NotFound, { CODE } from "./NotFound";

const convertKoaError = (ctx: Context): void|never => {
    switch(ctx.status) {
        case 404:
            throw new NotFound({ code: CODE.PageNotFound });
        case 405:
            throw new MethodNotAllowed({
                method: ctx.method, 
                allow: ctx.response.header['allow']?.toString().split(', ') ?? [] 
            })
    }
}

export default convertKoaError