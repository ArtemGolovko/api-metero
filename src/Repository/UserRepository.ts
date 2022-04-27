import { EntityData, MergeOptions } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/mysql";
import User from "../Entity/User";
import NotFound, { CODE } from "../Exception/NotFound";
import { hasProperty } from "../TSHelper";

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

    public async findAllWithJoins(limit = 10) {
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
            resoure: 'user',
            id: username
        });

        return user;
    }

    public mergeEntity(user: User, partial: Partial<User>) {
        for (const key of Object.keys(partial)) {
            if (hasProperty(user, key) && hasProperty(partial, key))
                user[key] = partial[key];
        }
    }
}