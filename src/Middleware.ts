import { DI } from './server';

import logger from 'koa-logger';
import { RequestContext } from '@mikro-orm/core';

import Router from './Controller/Router';
import { httpLogger } from './logger';
import handler from './Exception/HandleKoaErrors';

import { CORSandCSP } from './Security/browserSecurity';
import Koa, { Context, Next } from 'koa';

type TKoaLoggerArgs = [string, string, string, number | undefined, string | undefined, string | undefined];

const use = (app: Koa) => {
    app.use((ctx: Context, next: Next) => RequestContext.createAsync(DI.orm.em, next));
    app.use(
        logger(
            { transporter: (str: string, args: TKoaLoggerArgs) => httpLogger.http(str, args) }
        )
    );
    app.use(handler);
    app.use(Router.routes());
    app.use(Router.allowedMethods());
    app.use(CORSandCSP);
}

export default use;