import Koa from "koa";
import cors from "@koa/cors";
import { bodyParser } from "@koa/bodyparser";
import Router from "koa-router";

import { AppDataSource } from "./data-source";

import api from "./api";

import dotenv from "dotenv";

import websockify from "koa-websocket";
import ws from "./ws";

dotenv.config({ path: __dirname + "/../.env" });

const socket = websockify(new Koa());
socket.ws.use(ws.routes()).use(ws.allowedMethods());

socket.listen(4001, () => {
  console.log("socket is listening to port 4001");
});

AppDataSource.initialize().then(async () => {
  const app = new Koa();
  const router = new Router();

  app.use(
    cors({
      origin: (ctx) => {
        const whitelist = [
          "http://localhost:3000",
          "http://localhost:4000",
          "https://keukrak.r4bb1t.dev",
          "https://keukrak-server.r4bb1t.dev",
        ];
        const origin = ctx.request.get("origin");

        try {
          if (origin && whitelist.includes(origin)) return origin;
          else return "";
        } catch (e) {
          console.log(e);
          return "";
        }
      },
      credentials: true,
      exposeHeaders: ["authorization"],
    })
  );
  app.use(bodyParser());

  router.use("/api", api.routes());
  app.use(router.routes()).use(router.allowedMethods());
  // app.ws.use(ws.routes()).use(ws.allowedMethods());

  app.listen(4000, () => {
    console.log("server is listening to port 4000");
  });
});
