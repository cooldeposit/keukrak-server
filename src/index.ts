import Koa from "koa";
import cors from "@koa/cors";
import { bodyParser } from "@koa/bodyparser";
import Router from "koa-router";

import { AppDataSource } from "./data-source";

import api from "./api";

import dotenv from "dotenv";
import { initWebSocket } from "./utils/sendWebSoket";

dotenv.config({ path: __dirname + "/../.env" });

AppDataSource.initialize().then(async () => {
  const app = new Koa();
  const router = new Router();

  app.use(
    cors({
      origin: (ctx) => {
        const whitelist = ["http://localhost:3000", "http://localhost:4000"];
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

  app.listen(4000, () => {
    console.log("server is listening to port 4000");
  });

  initWebSocket();
});
