import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";
import { generateUUID } from "../../utils/generateUUID";
import { randomConcept, randomQuestions } from "../../utils/randomConcept";
import { randomNickname } from "../../utils/randomNickname";
import { sendAI, sendAdmin } from "../../ws/sendWebSoket";
import { RULE as rule } from "../../constants/rule";
import { getAnswer } from "../../utils/openai";
import { ADMIN_NICKNAME } from "../../constants/admin";

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
    aiNickname: undefined,
    users: room.users.map((user) => ({
      id: user.id,
      username: user.username,
      isOnline: user.isOnline,
      isAdmin: user.isAdmin,
    })),
    chats: room.chats.map((chat) => ({
      message: chat.message,
      nickname: chat.nickname,
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

  if (room.currentQuestion === 0) {
    const r = rule(
      room.concept,
      room.users.map((user) => user.username)
    );

    room.chats = [
      ...room.chats,
      ...r.map((message) => ({
        message,
        userId: room.users.find((user) => user.isAdmin)?.id,
        created_at: new Date(),
        nickname: ADMIN_NICKNAME,
      })),
    ];
    AppDataSource.getRepository(Room).save(room);

    r.map((message, i) => {
      setTimeout(() => {
        sendAdmin(message, room.id);
      }, 2000 * (i + 1));
    });
  } else {
    const r = await getAnswer(
      room.concept,
      room.questions[room.currentQuestion]
    );
    room.chats = [
      ...room.chats,
      {
        message: r,
        userId: "ai",
        created_at: new Date(),
        nickname: room.aiNickname,
      },
    ];
    AppDataSource.getRepository(Room).save(room);

    setTimeout(() => {
      sendAI(r, room.id, room.aiNickname);
    }, Math.random() * 1000 + r.length * 200 + 1000);
  }
};
