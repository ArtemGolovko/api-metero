import AbstractException from "./AbstractException";
import type { TBody } from "./AbstractException";

export const enum CODE {
    PageNotFound = 0,
    RosourceNotFound = 1
}

type TContext = {
    code: CODE,
    resource?: string,
    id?: string|number
}

export default class NotFound extends AbstractException {
    public constructor(
        private context: TContext
    ) {
        super();
    }

    private getMessage() {
        if (this.context.code === CODE.PageNotFound) return 'Page not found';

        if (this.context.resource === undefined || this.context.id === undefined)
            return 'Not Found: Resource not found';

        return `Not Found: The ${this.context.resource} resource with identifier '${this.context.id}' not found`;
    }

    private getHint() {
        if (this.context.code === CODE.PageNotFound) return 'No hint this time';

        return 'Check if identifier is valid and resource with this identifier exists';
    }

    public body(): TBody {
        return {
            code: `404:${this.context.code}`,
            message: this.getMessage(),
            hint: this.getHint()
        }
    }

    public statusCode(): number {
        return 404;
    }
}