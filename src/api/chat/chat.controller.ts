import { Context } from "koa";
import { AppDataSource } from "../../data-source";
import { Room } from "../../entities/room.entity";
import { sendAI } from "../../ws/sendWebSoket";
import { ADMIN_NICKNAME } from "../../constants/admin";
import {
  checkConversation,
  getConversation,
  questionConversation,
} from "../../utils/openai";

export const addChat = async (ctx: Context) => {
  const { roomId }: { roomId: string } = ctx.params;
  const { userId, message } = ctx.request.body as {
    userId: string;
    message: string;
  };

  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
    order: {
      chats: {
        created_at: "ASC",
      },
    },
  });

  if (!room) {
    ctx.status = 404;
    return;
  }

  room.chats = [
    ...room.chats,
    {
      created_at: new Date(),
      userId,
      message,
      nickname: room.users.find((user) => user.id === userId)?.nickname,
    },
  ];

  await AppDataSource.getRepository(Room).save(room);

  ctx.status = 204;

  reaction(roomId);
};

const reaction = async (roomId: string) => {
  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
    order: {
      chats: {
        created_at: "ASC",
      },
    },
  });
  const q = room.currentQuestion;
  const chats = room.chats.filter(
    (chat) => chat.nickname.name === ADMIN_NICKNAME.name
  );
  const chatlogs = room.chats
    .slice(room.chats.lastIndexOf(chats[chats.length - 1]), room.chats.length)
    .map((chat) => ({
      name: chat.nickname.name,
      text: chat.message,
    }));

  if (chatlogs.some((chat) => chat.name === room.aiNickname.name)) {
    setTimeout(async () => {
      console.log(".");
      const check = await checkConversation(
        room.concept.eng,
        room.questions[room.currentQuestion],
        chatlogs,
        room.aiNickname.name
      );
      console.log(check);
      if (check === "X") {
        if (Math.random() > getRatio(room.users.length)) {
          question(roomId, chatlogs, q);
        }
        return;
      }
      const aiConversation = await getConversation(
        room.concept.eng,
        room.questions[room.currentQuestion],
        chatlogs,
        room.aiNickname.name
      );

      setTimeout(async () => {
        const sroom = await AppDataSource.getRepository(Room).findOne({
          where: { id: roomId },
        });
        if (q !== sroom.currentQuestion) return;
        sendAI(aiConversation, room.id, room.aiNickname);
        sroom.chats = [
          ...sroom.chats,
          {
            message: aiConversation,
            userId: "ai",
            created_at: new Date(),
            nickname: sroom.aiNickname,
          },
        ];
        await AppDataSource.getRepository(Room).save(sroom);
      }, aiConversation.length * 200);
    }, Math.random() * 1000 + 2000);
  }
};

const question = async (
  roomId: string,
  chatlogs: { name: string; text: string }[],
  q: number
) => {
  const room = await AppDataSource.getRepository(Room).findOne({
    where: { id: roomId },
    order: {
      chats: {
        created_at: "ASC",
      },
    },
  });
  const aiConversation = await questionConversation(
    room.concept.eng,
    room.questions[room.currentQuestion],
    chatlogs,
    room.aiNickname.name
  );
  setTimeout(async () => {
    const sroom = await AppDataSource.getRepository(Room).findOne({
      where: { id: roomId },
    });
    //if (q !== sroom.currentQuestion) return;
    sendAI(aiConversation, room.id, room.aiNickname);
    sroom.chats = [
      ...sroom.chats,
      {
        message: aiConversation,
        userId: "ai",
        created_at: new Date(),
        nickname: sroom.aiNickname,
      },
    ];
    await AppDataSource.getRepository(Room).save(sroom);
  }, aiConversation.length * 200);
};

const getRatio = (n: number) => {
  // n이 클수록 ratio 증가
  return 1 - 0.5 / n;
};
