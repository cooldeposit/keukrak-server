import { Context } from "koa";

export const ws = async (ctx: Context) => {
  ctx.websocket.on("message", function (message) {
    console.log(message);
    ctx.websocket.send("pong");
  });

  ctx.websocket.on("close", () => {
    console.log(`User has left.`);
  });
};
