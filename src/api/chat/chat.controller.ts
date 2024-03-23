import { Context } from "koa";

export const addChat = async (ctx: Context) => {
  const { room }: { room: string } = ctx.params;
  const { message }: { message: string } = ctx.request.body;
};
