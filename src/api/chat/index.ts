import Router from "koa-router";
import * as Controller from "./chat.controller";

const chatRotuer = new Router();

chatRotuer.post("/:room", Controller.addChat);

export default chatRotuer;
