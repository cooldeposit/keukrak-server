import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import dotenv from "dotenv";

import api from "./api";

dotenv.config({ path: __dirname + "/../.env" });

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());

router.use("/api", api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("server is listening to port 4000");
});
