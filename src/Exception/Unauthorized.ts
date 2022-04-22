import AbstractException from "./AbstractException";
import type { TBody, THeaders } from "./AbstractException";

export const enum CODES {
    NoAuthorization = 0,
    NotFound = 1
}

type TConext = {
    code: CODES
}

export default class Unauthorized extends AbstractException {
    public constructor(
        private context: TConext
    ) {
        super();
    }

    private getMessage() {
        switch (this.context.code) { 
            case CODES.NoAuthorization: return 'No authorization found';
            case CODES.NotFound: return 'No user found';
        }
    }

    private getHint() {
        switch (this.context.code) {
            case CODES.NoAuthorization: return 'Add Authorization header with value: \'Bearer {username}\'';
            case CODES.NotFound: return 'Check if user with this username exists';
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
            case CODES.NoAuthorization:
                error = 'invalid_request';
                break;
            case CODES.NotFound:
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