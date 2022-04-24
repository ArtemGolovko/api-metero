import AbstractException from "./AbstractException";
import type { TBody, THeaders } from "./AbstractException";

export const enum CODE {
    NoAuthorization = 0,
    NotFound = 1
}

type TConext = {
    code: CODE
}

export default class Unauthorized extends AbstractException {
    public constructor(
        private context: TConext
    ) {
        super();
    }

    private getMessage() {
        switch (this.context.code) { 
            case CODE.NoAuthorization: return 'No authorization found';
            case CODE.NotFound: return 'No user found';
        }
    }

    private getHint() {
        switch (this.context.code) {
            case CODE.NoAuthorization: return 'Add Authorization header with value: \'Bearer {username}\'';
            case CODE.NotFound: return 'Check if user with this username exists';
        }
    }

    public body(): TBody {
        return {
            code: `401:${this.context.code}`,
            message: this.getMessage(),
            hint: this.getHint()
        }
    }

    public statusCode(): number {
        return 401;
    }

    public headers(): THeaders | null {
        let error: string;
        switch(this.context.code) {
            case CODE.NoAuthorization:
                error = 'invalid_request';
                break;
            case CODE.NotFound:
                error = 'invalid_token';
                break;
        }
        return {
            'WWW-Authenticate': `Bearer realm="Metero API",
                       error="${error}",
                       error_description="${this.getMessage()}"`
        };
    }
}