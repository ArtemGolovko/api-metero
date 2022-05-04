import { EntityRepository } from "@mikro-orm/mysql";
import Reply from "../Entity/Reply";
import NotFound, { CODE } from "../Exception/NotFound";

export default class ReplyRepository extends EntityRepository<Reply> {
    private replyQuery() {
        return this.createQueryBuilder('reply')
            .select([
                'reply.*',
                'likes.username as likesUsername',
                'count(likes.username) as likesCount'
            ])
            .leftJoinAndSelect('reply.author', 'author')
            .leftJoinAndSelect('reply.to', 'to')
            .leftJoin('reply.likes', 'likes')
            .groupBy('reply.id')
        ;
    }

    public async findAllByCommentId(commentId: number, limit = 10) {
        return await this.replyQuery()
            .where(
                { comment: { id: commentId } }
            )
            .limit(limit)
            .getResultList();
    }

    public async fillOneWithJoins(id: number) {
        const reply = await this.replyQuery()
            .where({ id: id })
            .getSingleResult();

        if (reply === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'reply',
            id: id
        });

        return reply;
    }
}