import Router from "koa-router";
import * as Controller from "./ws.controller";

const wsRouter = new Router();

wsRouter.get("/ws", Controller.ws);

export default wsRouter;
