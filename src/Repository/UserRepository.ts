import { EntityRepository } from "@mikro-orm/mysql";
import User from "../Entity/User";
import NotFound, { CODE } from "../Exception/NotFound";

export default class UserRepository extends EntityRepository<User> {
    private userQuery() {
        return this.createQueryBuilder('user')
            .select('*')
            .addSelect([
                'subscribers.username as subscribersUsername',
                'subscribed.username as subscribedUsername',
                'count(subscribers.username) as subscribersCount',
                'count(subscribed.username) as subscribedCount'
            ])
            .leftJoin('user.subscribers', 'subscribers')
            .leftJoin('user.subscribed', 'subscribed')
        ;
    }

    public async findAllWithJoins(limit = 10) {
        return await this.userQuery()
            .limit(limit)
            .getResultList();
    }

    public async findOneWithJoins(username: string, limit = 10) {
        const user = await this.userQuery()
            .where(username)
            .getSingleResult();

        if (user === null) throw new NotFound({
            code: CODE.RosourceNotFound,
            resoure: 'user',
            id: username
        });

        return user;
    }
}