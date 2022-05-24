import AbstractException from "./AbstractException";
import type { TBody } from "./AbstractException";

export const enum CODE {
    AlreadySubscribed = 0,
    AlreadyUnsubscribed = 1,
    AlreadyLiked = 2,
    AlreadyUnliked = 3,
    CannotSubscribe = 4,
    CannotUnsubscribe = 5
}

type TContext = {
    code: CODE
}

export default class Conflict extends AbstractException {
    public constructor(
        private context: TContext
    ) {
        super();
    }

    private getMessage() {
        switch(this.context.code) {
            case CODE.AlreadySubscribed: return 'Already subscribed.';
            case CODE.AlreadyUnsubscribed: return 'Already unsubscribed.';
            case CODE.AlreadyLiked: return 'Already liked.';
            case CODE.AlreadyUnliked: return 'Already unliked.';
            case CODE.CannotSubscribe: return 'You can\'t subscribe to yourself.';
            case CODE.CannotUnsubscribe: return 'You can\'t unsubscribe from yourself.';
        }
    }

    public body(): TBody {
        return {
            code: `409:${this.context.code}`,
            message: `Conflict: ${this.getMessage()}`,
            hint: 'Don\'t do this. Never again.'
        };
    }

    public statusCode(): number {
        return 409;
    }
}