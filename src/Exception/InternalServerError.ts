import AbstractException from "./AbstractException";
import type { TBody, THeaders } from "./AbstractException";

export default class InternalServerError extends AbstractException {
    public body(): TBody {
        return {
            code: '500',
            message: 'Internal Server Error: Undefined error',
            hint: 'Report error'
        }
    }

    public statusCode(): number {
        return 500;
    }
}