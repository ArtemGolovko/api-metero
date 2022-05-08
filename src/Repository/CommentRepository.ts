import { EntityRepository } from "@mikro-orm/mysql";
import Comment from "../Entity/Comment";
import NotFound, { CODE } from "../Exception/NotFound";

export default class CommentRepository extends EntityRepository<Comment> {
    private commentQuery() {
        return this.createQueryBuilder('comment')
            .select([
                'comment.*',
                'likes.username as likesUsername',
                'count(likes.username) as likesCount'
            ])
            .leftJoinAndSelect('comment.author', 'author')
            .leftJoin('comment.likes', 'likes')
            .groupBy('comment.id')
        ;
    }

    public async has(id: number) {
        const post = await this.createQueryBuilder('comment')
            .select('comment.id')
            .where({ id: id })
            .getSingleResult();

        if (post === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'comment',
            id: id
        });
    }


    public async findAllByPostId(postId: number, limit = 100) {
        return await this.commentQuery()
            .where(
                { post: { id: postId } }
            )
            .limit(limit)
            .getResultList()
        ;
    }

    public async findOneWithJoins(id: number) {
        const comment = await this.commentQuery()
            .where({ id: id })
            .getSingleResult();

        if (comment === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'comment',
            id: id
        });

        return comment;
    }
}