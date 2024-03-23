import Router from "koa-router";
import chat from "./chat";

const api = new Router();

api.use("/chat", chat.routes());

export default api;
