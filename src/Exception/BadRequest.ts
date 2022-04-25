import AbstractException from "./AbstractException";
import type { TBody } from "./AbstractException";

export const enum CODE {
    Validation = 0,
    NotFound = 1
}

type TContext = {
    code: CODE,
    message?: string
}

export class BadRequest extends AbstractException {
    public constructor(
        private context: TContext
    ) {
        super();
    }

    private getMessage() {
        switch (this.context.code) {
            case CODE.Validation:
                const ending = this.context.message ?? `. ${this.context.message}`;
                return 'Validation error occured' + ending;
            case CODE.NotFound: return 'Resource not found';
        }
    }

    private getHint() {
        switch (this.context.code) {
            case CODE.Validation: return 'to do';
            case CODE.NotFound: return 'to do';
        }
    }

    public body(): TBody {
        return {
            code: `400:${this.context.code}`,
            message: 'Bad Request: ' + this.getMessage(),
            hint: this.getHint()
        }
    }

    public statusCode(): number {
        return 400;
    }
}