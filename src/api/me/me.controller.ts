import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";

export const getNickname = async (ctx: Context) => {
  const { roomId, userId } = ctx.params;
  const room = await AppDataSource.getRepository(Room).findOne({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    ctx.status = 404;
    return;
  }

  const user = room.users.find((user) => user.id === userId);

  if (!user) {
    ctx.status = 404;
    return;
  }

  ctx.body = user;
};
