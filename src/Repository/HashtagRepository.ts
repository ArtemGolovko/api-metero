import { EntityRepository } from "@mikro-orm/mysql"
import Hashtag from "../Entity/Hashtag";

export default class HashtagRepository extends EntityRepository<Hashtag> {
    public async createMany(names: string[]) {
        await this.createQueryBuilder()
            .insert(names.map(name => ({ name })))
            .execute();
    }
}