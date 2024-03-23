import { MessageType, NicknameType } from "../types/message";
import { ADMIN_NICKNAME } from "../constants/admin";
import { WebSocket } from "ws";

function createSocket() {
  const socket = new WebSocket(process.env.WS_URL || "ws://localhost:4001");
  socket.onmessage = (msg) => console.log(msg);
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
