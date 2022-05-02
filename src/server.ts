import Koa from 'koa';
import logger from 'koa-logger';
import { RequestContext } from '@mikro-orm/core';

import Router from './Controller/Router';
import { httpLogger } from './logger';
import handler from './Exception/HandleKoaErrors';

import { CORSandCSP } from './Security/browserSecurity';

import type { TContainer } from './DependecyInjection';
import { load } from './DependecyInjection';

console.time("Bootstrap");

type TKoaLoggerArgs = [string, string, string, number | undefined, string | undefined, string | undefined];

export const DI = {} as TContainer;

export const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    await load();
  
    app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));
    app.use(logger({
      transporter: (str: string, args: TKoaLoggerArgs) => httpLogger.http(str, args)
    }));
    app.use(handler);
    app.use(Router.routes());
    app.use(Router.allowedMethods());
    app.use(CORSandCSP);
  
    app.listen(port, () => {
      console.log(`MikroORM Koa TS API started at http://localhost:${port}`);
      console.timeEnd("Bootstrap");
    });
})();