import Router from "koa-router";
import PostController from "./PostController";
import UserController from "./UserController";

const router = new Router();

const userController = new UserController();
const postController = new PostController();

router.use(userController.prefix(), userController.routes());
router.use(postController.prefix(), postController.routes());

export default router;