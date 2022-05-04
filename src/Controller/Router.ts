import Router from "koa-router";
import CommentController from "./CommentController";
import PostController from "./PostController";
import ReplyController from "./ReplyController";
import UserController from "./UserController";

const router = new Router();

const userController = new UserController();
const postController = new PostController();
const commentController = new CommentController();
const replyController = new ReplyController();

router.use(userController.prefix(), userController.routes());
router.use(postController.prefix(), postController.routes());
router.use(commentController.routes());
router.use(replyController.routes());

export default router;