import Router from "koa-router";
import * as Controller from "./ws.controller";

const wsRouter = new Router();

wsRouter.get("/", Controller.ws);

export default wsRouter;
