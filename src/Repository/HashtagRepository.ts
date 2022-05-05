import { EntityRepository } from "@mikro-orm/mysql"
import Hashtag from "../Entity/Hashtag";
import NotFound, { CODE } from "../Exception/NotFound";

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

    public async has(id: number) {
        const hashtag = await this.createQueryBuilder('hashtag')
            .select('hashtag.id')
            .where({ id: id })
            .getSingleResult();

        if (hashtag === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'hashtag',
            id: id
        });
    }

    public async findAllWithJoins(limit = 10) {
        return await this.hashtagQuery()
            .limit(limit)
            .getResultList()
        ;
    }

    public async findOneWithJoins(id: number) {
        const hashtag = await this.hashtagQuery()
            .where({ id: id })
            .getSingleResult();

        if (hashtag === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'hashtag',
            id: id
        });

        return hashtag;
    }
}