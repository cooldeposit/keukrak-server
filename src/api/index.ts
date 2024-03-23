import Router from "koa-router";
import chat from "./chat";
import room from "./room";

const api = new Router();

api.use("/chat", chat.routes());
api.use("/room", room.routes());

export default api;
