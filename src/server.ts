import Koa, { Context, Next } from 'koa';
import logger from 'koa-logger';
import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';

import Router from './Controller/Router';
import { defaultLogger, httpLogger } from './logger';
import handler from './Exception/HandleKoaErrors';

console.time("Bootstrap");

type TKoaLoggerArgs = [string, string, string, number | undefined, string | undefined, string | undefined];

export const DI = {
  logger: defaultLogger
} as {
  orm: MikroORM,
  em: EntityManager,
  logger: typeof defaultLogger
};

export const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
  
    app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));
    app.use(logger({
      transporter: (str: string, args: TKoaLoggerArgs) => httpLogger.http(str, args)
    }));
    app.use(handler);
    app.use(Router.routes());
    app.use(Router.allowedMethods());
  
    app.listen(port, () => {
      console.log(`MikroORM Koa TS test started at http://localhost:${port}`);
      console.timeEnd("Bootstrap");
    });
})();