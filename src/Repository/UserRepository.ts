import { EntityData, MergeOptions } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/mysql";
import User from "../Entity/User";
import NotFound, { CODE } from "../Exception/NotFound";

export default class UserRepository extends EntityRepository<User> {
    private userQuery() {
        return this.createQueryBuilder('user')
            .select([
                'user.*',
                'subscribers.username as subscribersUsername',
                'subscribed.username as subscribedUsername',
                'count(subscribers.username) as subscribersCount',
                'count(subscribed.username) as subscribedCount'
            ])
            .leftJoin('user.subscribers', 'subscribers')
            .leftJoin('user.subscribed', 'subscribed')
            .groupBy('user.username')
        ;
    }

    public async has(username: string) {
        const user = await this.createQueryBuilder('user')
            .select('user.username')
            .where({ username: username })
            .getSingleResult();

        if (user === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'user',
            id: username
        });
    }

    public async findAllWithJoins(limit = 100) {
        return await this.userQuery()
            .limit(limit)
            .getResultList();
    }

    public async findOneWithJoins(username: string) {
        const user = await this.userQuery()
            .where({ username: username })
            .getSingleResult();

        if (user === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'user',
            id: username
        });

        return user;
    }

    public async update(username: string, partial: EntityData<User>) {
        const result = await this.createQueryBuilder()
            .update(partial)
            .where({ username: username })
            .execute();
        
        if (result.affectedRows === 0) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'user',
            id: username
        });
    }

    public async delete(username: string) {
        const result = await this.createQueryBuilder()
            .delete()
            .where({ username: username })
            .execute();
        
        if (result.affectedRows === 0) throw new NotFound({
            code: CODE.RosourceNotFound,
            resource: 'user',
            id: username
        });
    }
}