import AbstractException from "./AbstractException";
import type { TBody } from "./AbstractException";

export const enum CODES {
    Validation = 0,
    NotFound = 1
}

type TContext = {
    code: CODES,
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
            case CODES.Validation:
                const ending = this.context.message ?? `. ${this.context.message}`;
                return 'Validation error occured' + ending;
            case CODES.NotFound: return 'Resource not found';
        }
    }

    private getHint() {
        switch (this.context.code) {
            case CODES.Validation: return 'to do';
            case CODES.NotFound: return 'to do';
        }
    }

    public body(): TBody {
        return {
            code: `400:${this.context.code}`,
            message: this.getMessage(),
            hint: this.getHint()
        }
    }

    public statusCode(): number {
        return 400;
    }
}