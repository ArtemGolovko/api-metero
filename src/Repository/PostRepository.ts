import { EntityRepository } from "@mikro-orm/mysql";
import Post from "../Entity/Post";

export default class PostRepository extends EntityRepository<Post> {

}