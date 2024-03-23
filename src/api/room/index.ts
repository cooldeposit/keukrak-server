import Router from "koa-router";
import * as Controller from "./room.controller";

const roomRouter = new Router();

roomRouter.post("/", Controller.create);
roomRouter.get("/:roomId", Controller.getRoom);
roomRouter.post("/:roomId", Controller.changeConnect);
roomRouter.post("/:roomId/enter", Controller.enterRoom);
roomRouter.get("/:roomId/next", Controller.nextQuestion);

export default roomRouter;
