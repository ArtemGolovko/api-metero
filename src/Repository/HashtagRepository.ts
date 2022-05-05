import { EntityRepository } from "@mikro-orm/mysql"
import Hashtag from "../Entity/Hashtag";

export default class HashtagRepository extends EntityRepository<Hashtag> {
    public async createMany(names: string[]) {
        await this.createQueryBuilder()
            .insert(names.map(name => ({ name })))
            .execute();
    }

    private hashtagQuery() {
        return this.createQueryBuilder('hashtag')
            .select([
                'hashtag.*',
                'associatedPosts.id as associatedPostsId',
                'count(associatedPosts.id) as associatedPostsCount'
            ])
            .leftJoin('hashtag.associatedPosts', 'associatedPosts')
            .groupBy('hashtag.id')
        ;
    }

    public async findAllWithJoins(limit = 10) {
        return await this.hashtagQuery()
            .limit(limit)
            .getResultList()
        ;
    }
}