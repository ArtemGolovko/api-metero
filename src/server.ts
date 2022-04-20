import Koa from 'koa';
import logger from 'koa-logger';
import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';

import Router from './Controller/Router';

console.time("Bootstrap");

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
};

export const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
  
    app.use((ctx, next) => RequestContext.createAsync(DI.orm.em, next));
    app.use(logger());
    app.use(Router.routes());
    app.use(Router.allowedMethods());
  
    app.listen(port, () => {
      console.log(`MikroORM Koa TS test started at http://localhost:${port}`);
      console.timeEnd("Bootstrap");
    });
})();