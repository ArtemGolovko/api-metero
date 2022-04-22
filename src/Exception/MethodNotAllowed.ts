import AbstractException, { TBody } from "./AbstractException";

type TContext = {
    method: string,
    allow: string[]
}

export default class MethodNotAllowed extends AbstractException {
    public constructor(
        private context: TContext
    ) {
        super();
    }

    public body(): TBody {
        return {
            code: '405',
            message: `Method Not Allowed: Method ${this.context.method} is not allowed. Allowed method(s): ${this.context.allow.join(', ')}`,
            hint: `Try ${this.context.allow.join(', ')} method(s)`
        };
    }

    public statusCode(): number {
        return 405;
    }
}