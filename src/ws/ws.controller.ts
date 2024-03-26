import { Context } from "koa";
import WebSocket from "ws";

const sockets: WebSocket[] = [];

export const ws = async (ctx: Context) => {
  sockets.push(ctx.websocket);

  ctx.websocket.on("message", (message) => {
    try {
      const parsed = JSON.parse(message.toString());
      console.log(parsed);

      if (parsed.type === "server") {
        console.log(sockets.length);
        sockets.forEach((socket) => {
          socket.send(parsed.payload);
        });
      } else {
        sockets.forEach((socket) => {
          socket.send(message.toString());
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  ctx.websocket.on("close", () => {
    console.log(`User has left.`);
    sockets.splice(sockets.indexOf(ctx.websocket), 1);
  });
};
