import AbstractException from "./AbstractException";
import type { TBody } from "./AbstractException";

export default class Forbidden extends AbstractException {
    public body(): TBody {
        return {
            code: '403',
            message: 'Forbidden: Currntly authenticated user doesn\'t have access to this resource',
            hint: 'Check if Currntly authenticated user is own or has access on this resource'
        };
    }

    public statusCode(): number {
        return 403;
    }
}