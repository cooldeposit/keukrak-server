import "reflect-metadata";
import { DataSource } from "typeorm";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "aws-0-ap-northeast-2.pooler.supabase.com",
  port: 5432,
  username: "postgres.tylicybhzidwbtcdkeue",
  database: "postgres",
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: true,
  logger: "file",
  entities:
    process.env.NODE_ENV === "production"
      ? [__dirname + "/entities/*.entity{.ts,.js}"]
      : [__dirname + "/entities/*.entity{.ts,.js}"],
});
