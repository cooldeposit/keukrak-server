import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";
import { generateUUID } from "../../utils/generateUUID";
import { randomConcept, randomQuestions } from "../../utils/randomConcept";
import { randomNickname } from "../../utils/randomNickname";

export const create = async (ctx: Context) => {
  const { name }: { name: string } = ctx.request.body;
  const id = generateUUID();
  const concept = randomConcept();
  const questions = randomQuestions();

  const room = AppDataSource.getRepository(Room).create({
    concept,
    users: [
      {
        id,
        username: name,
        isOnline: true,
        isAdmin: true,
        nickname: randomNickname(),
      },
    ],
    questions,
  });

  await AppDataSource.getRepository(Room).save(room);

  ctx.body = { roomId: room.id, userId: id, concept };
  ctx.status = 201;
};

export const changeConnect = async (ctx: Context) => {
  const { roomId } = ctx.params;
  const { userId, connect }: { userId: string; connect: boolean } =
    ctx.request.body;

  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
  });
  if (!room) {
    ctx.status = 404;
    return;
  }

  const userIndex = room.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    ctx.status = 404;
    return;
  }

  room.users[userIndex].isOnline = connect;
  await AppDataSource.getRepository(Room).save(room);
  ctx.status = 204;
};

export const enterRoom = async (ctx: Context) => {
  const { roomId } = ctx.params;
  const { name }: { name: string } = ctx.request.body;

  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
  });
  if (!room) {
    ctx.status = 404;
    return;
  }

  const id = generateUUID();

  const nickname = randomNickname();

  room.users.push({
    id,
    username: name,
    isOnline: true,
    isAdmin: false,
    nickname,
  });
  await AppDataSource.getRepository(Room).save(room);
  ctx.body = { userId: id, concept: room.concept };
  ctx.status = 201;
};

export const getRoom = async (ctx: Context) => {
  const { roomId } = ctx.params;
  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
    order: {
      created_at: "DESC",
    },
  });
  if (!room) {
    ctx.status = 404;
    return;
  }
  ctx.body = {
    ...room,
    users: room.users.map((user) => ({
      id: user.id,
      username: user.username,
      isOnline: user.isOnline,
      isAdmin: user.isAdmin,
    })),
    chats: room.chats.map((chat) => ({
      message: chat.message,
      nickname: room.users.find((user) => user.id === chat.userId)?.nickname,
      created_ad: chat.created_at,
    })),
  };
  ctx.status = 200;
};

export const nextQuestion = async (ctx: Context) => {
  const { roomId } = ctx.params;
  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
  });
  if (!room) {
    ctx.status = 404;
    return;
  }

  if (room.currentQuestion + 1 >= room.questions.length) {
    ctx.status = 400;
    return;
  }

  console.log(room.currentQuestion);

  room.currentQuestion += 1;
  await AppDataSource.getRepository(Room).save(room);
  ctx.body = {
    question: room.questions[room.currentQuestion],
    index: room.currentQuestion,
  };
};
