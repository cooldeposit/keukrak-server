import WebSocket from "ws";
import { MessageType, NicknameType } from "../types/message";

const url = `ws://${process.env.APP_HOST}/api/ws`;

export const sendAdmin = (message: string, id: string) => {
  const ws = new WebSocket(url);

  ws.send(
    JSON.stringify({
      type: "message",
      id,
      payload: {
        nickname: {
          icon: "👤",
          name: "사회자",
          color: "#dddddd",
        },
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
  const ws = new WebSocket(url);

  ws.send(
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
