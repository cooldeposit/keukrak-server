import Router from "koa-router";
import * as Controller from "./me.controller";

const meRouter = new Router();

meRouter.get("/:roomId/:userId", Controller.getNickname);

export default meRouter;
