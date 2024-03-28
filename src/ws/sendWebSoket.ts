import { MessageType, NicknameType } from "../types/message";
import { ADMIN_NICKNAME } from "../constants/admin";
import { WebSocket } from "ws";

function createSocket() {
  const socket = new WebSocket(process.env.WS_URL || "ws://localhost:4001");
  socket.onopen = () => console.log("connected to socket");
  return socket;
}
const s = createSocket();

const send = (a: string) =>
  s.send(
    JSON.stringify({
      type: "server",
      payload: a,
    })
  );

export const sendAdmin = (message: string, id: string) => {
  send(
    JSON.stringify({
      type: "message",
      id,
      payload: {
        nickname: ADMIN_NICKNAME,
        content: message,
      },
    } as MessageType)
  );
};

export const sendNextQuestion = (
  currentQuestion: number,
  question: string,
  id: string
) => {
  send(
    JSON.stringify({
      type: "question",
      id,
      payload: { currentQuestion, question },
    } as MessageType)
  );
};

export const sendAI = (
  message: string,
  id: string,
  aiNickname: NicknameType
) => {
  send(
    JSON.stringify({
      type: "message",
      id,
      payload: {
        nickname: aiNickname,
        content: message,
      },
    } as MessageType)
  );
};

export const sendPoll = (id: string) => {
  send(
    JSON.stringify({
      type: "poll",
      id,
    })
  );
};

export const sendPollResult = (
  id: string,
  payload: {
    userId: string;
    nickname: NicknameType;
    score: number;
    friends: {
      name: string;
      realName: string;
      nickname: NicknameType;
      correct: boolean;
    }[];
  }[]
) => {
  send(
    JSON.stringify({
      type: "pollend",
      id,
      payload,
    })
  );
};
