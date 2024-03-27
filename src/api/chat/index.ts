import Router from "koa-router";
import * as Controller from "./chat.controller";

const chatRotuer = new Router();

chatRotuer.post("/:roomId", Controller.addChat);

export default chatRotuer;
