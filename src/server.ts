import Koa from 'koa';

import type { TContainer } from './DependecyInjection';
import load from './DependecyInjection';
import use from './Middleware';


console.time("Bootstrap");

export const DI = {} as TContainer;

const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    await load(DI);
    use(app);

    app.listen(port, () => {
        console.log(`MikroORM Koa TS API started at http://localhost:${port}`);
        console.timeEnd("Bootstrap");
    });
})();