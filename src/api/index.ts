import Router from "koa-router";
import chat from "./chat";
import room from "./room";
import me from "./me";

const api = new Router();

api.use("/chat", chat.routes());
api.use("/room", room.routes());
api.use("/me", me.routes());

export default api;
