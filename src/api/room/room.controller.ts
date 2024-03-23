import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";
import { generateUUID } from "../../utils/generateUUID";
import { randomConcept, randomQuestions } from "../../utils/randomConcept";
import { randomNickname } from "../../utils/randomNickname";
import {
  sendAI,
  sendAdmin,
  sendPoll,
  sendPollResult,
} from "../../ws/sendWebSoket";
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
    concept: room.concept.kor,
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
    sendPoll(room.id);
    ctx.status = 204;
    return;
  }

  room.currentQuestion += 1;

  await AppDataSource.getRepository(Room).save(room);

  ctx.body = {
    question: room.questions[room.currentQuestion],
    index: room.currentQuestion,
  };

  if (room.currentQuestion === 0) {
    const r = rule(
      room.concept.kor,
      room.users.map((user) => user.username)
    );

    r.map((message, i) => {
      setTimeout(() => {
        sendAdmin(message, room.id);
        room.chats = [
          ...room.chats,
          {
            message,
            userId: room.users.find((user) => user.isAdmin)?.id,
            created_at: new Date(),
            nickname: ADMIN_NICKNAME,
          },
        ];
        AppDataSource.getRepository(Room).save(room);
      }, 2000 * (i + 1) + 2000);
    });
  }

  const r = await getAnswer(
    room.concept.eng,
    room.questions[room.currentQuestion]
  );

  setTimeout(() => {
    sendAI(r, room.id, room.aiNickname);
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
  }, (room.currentQuestion === 0 ? 20000 : 8000) + Math.random() * 1000 + r.length * 500);
};

export const poll = async (ctx: Context) => {
  const { roomId } = ctx.params;

  const { userId, answers } = ctx.request.body as {
    userId: string;
    answers: { nickname: string; id: string }[];
  };

  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
  });

  if (!room) {
    ctx.status = 404;
    return;
  }

  room.poll.push({ userId, answers });

  await AppDataSource.getRepository(Room).save(room);

  if (room.poll.length === room.users.length) {
    const result = room.poll.map((poll) => ({
      userId: poll.userId,
      nickname: room.users.find((user) => user.id === poll.userId)?.nickname,
      result: {
        guessAI:
          poll.answers.find((answer) => answer.id === "ai")?.nickname ===
          room.aiNickname.name,
        friends: poll.answers.map((answer) => {
          const correct = room.users.some(
            (user) =>
              user.id === answer.id && user.nickname.name === answer.nickname
          );
          const ans = room.users.find((user) => user.id === answer.id);
          return { name: ans.username, correct: correct ? true : false };
        }),
      },
      score: 0,
    }));

    result.map((r) => {
      r.score = r.result.guessAI ? 1 : 0;
      r.result.friends.map((f) => {
        if (f.correct) {
          r.score += 1;
        }
      });

      r.score = (r.score / (room.users.length + 1)) * 100;
    });

    sendPollResult(room.id, result);
  }
};
