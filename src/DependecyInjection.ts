import { EntityManager, MikroORM } from '@mikro-orm/core';

import UserRepository from './Repository/UserRepository';
import User from './Entity/User';
import PostRepository from './Repository/PostRepository';
import Post from './Entity/Post';
import HashtagRepository from './Repository/HashtagRepository';
import Hashtag from './Entity/Hashtag';
import CommentRepository from './Repository/CommentRepository';
import Comment from './Entity/Comment';
import { defaultLogger } from './logger';

import { DI } from './server';

export type TContainer = {
    orm: MikroORM,
    em: EntityManager,
    userRepository: UserRepository,
    postRepository: PostRepository,
    hashtagRepository: HashtagRepository,
    commentRepository: CommentRepository,
    logger: typeof defaultLogger
};


export const load = async () => {
    DI.logger = defaultLogger;
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.userRepository = DI.em.getRepository(User);
    DI.postRepository = DI.em.getRepository(Post);
    DI.hashtagRepository = DI.em.getRepository(Hashtag);
    DI.commentRepository = DI.em.getRepository(Comment);
};