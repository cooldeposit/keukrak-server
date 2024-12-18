import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";
import { generateUserId } from "../../utils/generateUserId";
import { randomConcept, randomQuestions } from "../../utils/randomConcept";
import { randomNickname } from "../../utils/randomNickname";
import {
  sendAI,
  sendAdmin,
  sendNextQuestion,
  sendPoll,
  sendPollResult,
} from "../../ws/sendWebSoket";
import { RULE as rule } from "../../constants/rule";
import { getAnswer } from "../../utils/openai";
import { ADMIN_NICKNAME } from "../../constants/admin";

export const create = async (ctx: Context) => {
  const { name }: { name: string } = ctx.request.body;
  const id = generateUserId();
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
    aiNickname: randomNickname(),
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

  const id = generateUserId();

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
    nicknames: [...room.users.map((user) => user.nickname), room.aiNickname],
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
    if (!room.flag) {
      sendAdmin(
        `대화 끝!
    이제 누가 누군지 다 알겠지? 
    
    다 맞히면 극락이지만,
    못 맞힌다면 ... 그건 알아서 해 😇 `,
        room.id
      );
      room.flag = true;
      room.status = "poll";
      await AppDataSource.getRepository(Room).save(room);
    }

    setTimeout(async () => {
      sendPoll(room.id);
    }, 2000);
    ctx.status = 204;
    return;
  }

  room.currentQuestion += 1;
  await AppDataSource.getRepository(Room).save(room);

  ctx.body = {
    question: room.questions[room.currentQuestion],
    currentQuestion: room.currentQuestion,
  };

  if (room.currentQuestion === 0) {
    room.status = "chat";
    await AppDataSource.getRepository(Room).save(room);

    const r = [
      ...rule(
        room.concept.kor,
        room.users.map((user) => user.username)
      ),
      `[${room.currentQuestion + 1}]번 질문!
    
    [${room.questions[room.currentQuestion]}]`,
    ];

    r.map((message, i) => {
      setTimeout(async () => {
        sendAdmin(message, room.id);
      }, 2000 * (i + 1) + 2000);
    });

    setTimeout(async () => {
      const sroom = await AppDataSource.getRepository(Room).findOne({
        where: { id: roomId },
      });
      sroom.chats = [
        ...sroom.chats,
        ...r.map((message) => ({
          message,
          userId: "moderator",
          created_at: new Date(),
          nickname: ADMIN_NICKNAME,
        })),
      ];
      await AppDataSource.getRepository(Room).save(sroom);
      sendNextQuestion(
        room.currentQuestion,
        room.questions[room.currentQuestion],
        room.id
      );
    }, 2000 * r.length + 2000);
  } else {
    const sroom = await AppDataSource.getRepository(Room).findOne({
      where: { id: roomId },
    });
    sroom.chats = [
      ...sroom.chats,
      {
        message: `[${room.currentQuestion + 1}]번 질문!
        
  
    [${room.questions[room.currentQuestion]}]`,
        userId: "moderator",
        created_at: new Date(),
        nickname: ADMIN_NICKNAME,
      },
    ];

    await AppDataSource.getRepository(Room).save(sroom);

    sendAdmin(
      `[${room.currentQuestion + 1}]번 질문!
  
    [${room.questions[room.currentQuestion]}]`,
      room.id
    );
    sendNextQuestion(
      room.currentQuestion,
      room.questions[room.currentQuestion],
      room.id
    );
  }

  const aiAnswer = await getAnswer(
    room.concept.eng,
    room.questions[room.currentQuestion],
    room.concept.example
  );

  setTimeout(async () => {
    sendAI(aiAnswer, room.id, room.aiNickname);

    const sroom = await AppDataSource.getRepository(Room).findOne({
      where: { id: roomId },
    });
    sroom.chats = [
      ...sroom.chats,
      {
        message: aiAnswer,
        userId: "ai",
        created_at: new Date(),
        nickname: sroom.aiNickname,
      },
    ];
    await AppDataSource.getRepository(Room).save(sroom);
  }, (room.currentQuestion === 0 ? 15000 : 10000) + Math.random() * 3000 + aiAnswer.length * 1000);
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

  room.poll = [
    ...room.poll,
    {
      userId,
      answers: answers.map((answer) => ({
        id: answer.id || "ai",
        nickname: answer.nickname,
      })),
    },
  ];

  await AppDataSource.getRepository(Room).save(room);

  ctx.body = {};

  if (room.poll.length === room.users.length) {
    const result = room.poll.map((poll) => ({
      userId: poll.userId,
      nickname: room.users.find((user) => user.id === poll.userId)?.nickname,
      friends: poll.answers.map((answer) => {
        const correct =
          room.users.some(
            (user) =>
              user.id === answer.id && user.nickname.name === answer.nickname
          ) ||
          (answer.id === "ai" && room.aiNickname.name === answer.nickname);

        const ans = room.users.find((user) => user.id === answer.id);
        const ss = room.users.find(
          (user) => user.nickname.name === answer.nickname
        );
        return {
          name: ans?.username ?? "AI",
          realName: ss?.username || "AI",
          nickname: ss?.nickname || room.aiNickname,
          correct,
        };
      }),
      score: 0,
    }));

    result.map((r) => {
      r.friends.map((f) => {
        if (f.correct) {
          r.score += 1;
        }
      });

      r.score = (r.score / room.users.length) * 100;
    });
    room.status = "pollend";
    room.result = result;
    await AppDataSource.getRepository(Room).save(room);
    sendPollResult(room.id, result);
  }
};
