import { EntityRepository } from "@mikro-orm/mysql";
import Reply from "../Entity/Reply";

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
}