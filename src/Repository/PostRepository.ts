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

    public async findAllWithJoins(limit = 10){
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
}