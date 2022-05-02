import { EntityRepository } from "@mikro-orm/mysql";
import Comment from "../Entity/Comment";

export default class CommentRepository extends EntityRepository<Comment> {
    private commentQuery() {
        return this.createQueryBuilder('comment')
            .select([
                'comment.*',
                'likes.username as likesUsername',
                'count(likes.username) as likesCount'
            ])
            .leftJoinAndSelect('comment.post', 'post')
            .leftJoinAndSelect('comment.author', 'author')
            .leftJoin('comment.likes', 'likes')
            .groupBy('comment.id')
        ;
    }

    public async findAllByPostId(postId: number) {
        return await this.commentQuery()
            .where(
                { post: { id: postId } }
            )
            .getResultList()
        ;
    }
}