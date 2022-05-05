import Koa from 'koa';

import type { TContainer } from './DependecyInjection';
import load from './DependecyInjection';
import use from './Middleware';

import http = require('http');

export const DI = {} as TContainer;

const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    await load(DI);
    use(app);

    if (process.env.NODE_ENV === 'production') {
        http.createServer(app.callback()).listen();
    } else {
        app.listen(port, () => {
            console.log(`MikroORM Koa TS API started at http://localhost:${port}`);
        });
    }
})();