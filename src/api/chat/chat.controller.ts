import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";

export const addChat = async (ctx: Context) => {
  const { room }: { room: string } = ctx.params;
  const { userId, message }: { userId: string; message: string } =
    ctx.request.body;

  console.log(room, userId, message);

  const roomItem = await AppDataSource.getRepository(Room).findOne({
    where: { id: room },
  });

  if (!roomItem) {
    ctx.status = 404;
    return;
  }

  roomItem.chats.push({
    created_at: new Date(),
    userId,
    message,
    nickname: roomItem.users.find((user) => user.id === userId)?.nickname,
  });

  await AppDataSource.getRepository(Room).save(roomItem);

  ctx.status = 204;
};
