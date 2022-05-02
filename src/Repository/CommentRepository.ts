import { EntityRepository } from "@mikro-orm/mysql";
import Comment from "../Entity/Comment";

export default class CommentRepository extends EntityRepository<Comment> {

}