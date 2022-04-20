import Router from "koa-router";
import UserController from "./UserController";

const router = new Router();

const userController = new UserController();

router.use(userController.prefix(), userController.routes());

export default router;