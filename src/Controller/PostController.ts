import { Context } from "koa";
import Router, { IMiddleware } from "koa-router";
import Unauthorized, { CODE } from "../Exception/Unauthorized";
import { DI } from "../server";
import validate from "../Validator/Validate";
import { createSchema, TCreate } from "../Validator/Schema/PostSchema";
import AbstractController from "./AbstractController";
import Hashtag from "../Entity/Hashtag";

export default class PostController extends AbstractController {
    private async createPost(ctx: Context) {
        const user = await DI.userRepository.findOneOrFail({
            username: this.auth()
        }).catch(() => { throw new Unauthorized({ code: CODE.NotFound }) });

        const body = validate<TCreate>(createSchema, await this.json());
        const post = DI.postRepository.create({
            author: user,
            createdAt: new Date(),
            images: body.images,
            text: body.text
        })

        post.hashtags.set(await this.hashtags(body.hashtags));

        const markedUsers = await DI.userRepository.find({
             username: body.profileMarks
        });

        post.markedUsers.set(markedUsers);

        await DI.em.persistAndFlush(post);

        ctx.status = 200;
    }

    private async hashtags(names: string[]): Promise<Hashtag[]> {
        const hashtags = await DI.hashtagRepository.find({
            name: names
        });

        const foundHashtags = hashtags.map(hashtag => hashtag.name);

        const newHashtags = names.filter(hashtag => !foundHashtags.includes(hashtag));

        if (newHashtags.length !== 0) {
            await DI.hashtagRepository.createMany(newHashtags);
            return await DI.hashtagRepository.find({
                name: names
            });
        }

        return hashtags;
    }

    public routes(): IMiddleware<any, {}> {
        const router = new Router();

        router.post('s', this.createMiddleware(this.createPost));

        return router.routes();
    }
    
    public prefix(): string {
        return '/post';
    }
}