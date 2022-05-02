import Koa from 'koa';
import logger from 'koa-logger';
import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';

import Router from './Controller/Router';
import { defaultLogger, httpLogger } from './logger';
import handler from './Exception/HandleKoaErrors';

import UserRepository from './Repository/UserRepository';
import User from './Entity/User';
import { CORSandCSP } from './Security/browserSecurity';
import PostRepository from './Repository/PostRepository';
import Post from './Entity/Post';
import HashtagRepository from './Repository/HashtagRepository';
import Hashtag from './Entity/Hashtag';
import CommentRepository from './Repository/CommentRepository';
import Comment from './Entity/Comment';

console.time("Bootstrap");

type TKoaLoggerArgs = [string, string, string, number | undefined, string | undefined, string | undefined];

export const DI = {
  logger: defaultLogger
} as {
  orm: MikroORM,
  em: EntityManager,
  userRepository: UserRepository,
  postRepository: PostRepository,
  hashtagRepository: HashtagRepository,
  commentRepository: CommentRepository,
  logger: typeof defaultLogger
};

export const app = new Koa();

const port = process.env.PORT || 3000;

(async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.userRepository = DI.em.getRepository(User);
    DI.postRepository = DI.em.getRepository(Post);
    DI.hashtagRepository = DI.em.getRepository(Hashtag);
    DI.commentRepository = DI.em.getRepository(Comment);
  
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