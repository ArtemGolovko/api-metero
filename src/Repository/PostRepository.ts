import { EntityRepository } from "@mikro-orm/mysql";
import Post from "../Entity/Post";
import NotFound, { CODE } from "../Exception/NotFound";

export default class PostRepository extends EntityRepository<Post> {
    private postQuery() {
        return this.createQueryBuilder('post')
            .select([
                'post.*',
                'likes.username as likesUsername',
                'count(likes.username) as likesCount'
            ])
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.hashtags', 'hashtags')
            .leftJoinAndSelect('post.markedUsers', 'markedUsers')
            .leftJoin('post.likes', 'likes')
            .groupBy('post.id')
        ;
    }

    public async has(id: number) {
        const post = await this.createQueryBuilder('post')
            .select('post.id')
            .where({ id: id })
            .getSingleResult();

        if (post === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'post',
            id: id
        });
    }

    public async findAllWithJoins(limit = 100){
        return await this.postQuery()
            .limit(limit)
            .getResultList()
        ;
    }

    public async findOneWithJoins(id: number) {
        const post = await this.postQuery()
            .where({ id: id })
            .getSingleResult();

        if (post === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'post',
            id: id,
        });

        return post;
    }

    public async findAllByAuthorUsername(username: string, limit = 100) {
        return await this.postQuery()
            .where(
                { author: { username: username } }
            )
            .limit(limit)
            .getResultList();
    }

    public async findAllbyHashtagId(id: number, limit = 100) {
        return await this.postQuery()
            .where(
                { comments: { id: id} }
            )
            .limit(limit)
            .getResultList();
    }
}