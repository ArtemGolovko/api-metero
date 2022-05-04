import { EntityManager, MikroORM } from '@mikro-orm/core';
import { defaultLogger } from './logger';

import User from './Entity/User';
import Post from './Entity/Post';
import Comment from './Entity/Comment';
import Reply from './Entity/Reply';
import Hashtag from './Entity/Hashtag';

import UserRepository from './Repository/UserRepository';
import PostRepository from './Repository/PostRepository';
import CommentRepository from './Repository/CommentRepository';
import ReplyRepository from './Repository/ReplyRepository';
import HashtagRepository from './Repository/HashtagRepository';


export type TContainer = {
    orm: MikroORM,
    em: EntityManager,
    userRepository: UserRepository,
    postRepository: PostRepository,
    hashtagRepository: HashtagRepository,
    commentRepository: CommentRepository,
    replyRepository: ReplyRepository,
    logger: typeof defaultLogger
};


const load = async (DI: TContainer) => {
    DI.logger = defaultLogger;
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.userRepository = DI.em.getRepository(User);
    DI.postRepository = DI.em.getRepository(Post);
    DI.hashtagRepository = DI.em.getRepository(Hashtag);
    DI.commentRepository = DI.em.getRepository(Comment);
    DI.replyRepository = DI.em.getRepository(Reply);
};

export default load;