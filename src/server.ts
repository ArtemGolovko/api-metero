import Koa from 'koa';

import type { TContainer } from './DependecyInjection';
import { load } from './DependecyInjection';

console.time("Bootstrap");

export const DI = {} as TContainer;

export const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    await load();
    import('./Middleware');
  
    app.listen(port, () => {
      console.log(`MikroORM Koa TS API started at http://localhost:${port}`);
      console.timeEnd("Bootstrap");
    });
})();