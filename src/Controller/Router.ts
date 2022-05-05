import Router from "koa-router";
import CommentController from "./CommentController";
import HashtagController from "./HashtagController";
import PostController from "./PostController";
import ReplyController from "./ReplyController";
import UserController from "./UserController";

const router = new Router();

const userController = new UserController();
const postController = new PostController();
const commentController = new CommentController();
const replyController = new ReplyController();
const hashtagController = new HashtagController();

router.use(userController.prefix(), userController.routes());
router.use(postController.prefix(), postController.routes());
router.use(commentController.routes());
router.use(replyController.routes());
router.use(hashtagController.prefix(), hashtagController.routes());

export default router;