import AbstractException from "./AbstractException";
import type { TBody } from "./AbstractException";

type TContext = {
    resoure: string,
    id: string|number
}

export default class NotFound extends AbstractException {
    public constructor(
        private context: TContext
    ) {
        super();
    }

    public body(): TBody {
        return {
            code: "404",
            message: `Not Found: The ${this.context.resoure} resource with identifier '${this.context.id}' not found`,
            hint: 'Check if identifier is valid and resource with this identifier exists'
        }
    }

    public statusCode(): number {
        return 404;
    }
}