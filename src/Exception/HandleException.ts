import { DI } from "../server";
import AbstractException from "./AbstractException";
import type { TBody, THeaders } from "./AbstractException";
import InternalServerError from "./InternalServerError";

const convertToException = (error: any): AbstractException => {
    return new InternalServerError();
}

type THandleResult = {
    body: TBody,
    status: number,
    headers: THeaders|null
}

const handleException = (exception: any): THandleResult => {
    if (!(exception instanceof AbstractException)) {
        exception = convertToException(exception);
        DI.logger.warn('Nonstandart error occured');
    }
    const typedException = exception as AbstractException;
    return {
        body: typedException.body(),
        status: typedException.statusCode(),
        headers: typedException.headers()
    };
}

export default handleException;