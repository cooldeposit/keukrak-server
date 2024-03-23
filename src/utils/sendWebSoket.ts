import WebSocket from "ws";
import { MessageType } from "../types/message";

const url = `ws://${process.env.APP_HOST}/api/ws`;

export const sendAdmin = (message: string, id: string) => {
  const ws = new WebSocket(url);

  ws.send(
    JSON.stringify({
      type: "admin",
      id,
      payload: {
        content: message,
      },
    } as MessageType)
  );
};

export const sendAI = (message: string, id: string, aiNickname: string) => {
  const ws = new WebSocket(url);

  ws.send(
    JSON.stringify({
      type: "message",
      id,
      payload: {
        user: aiNickname,
        content: message,
      },
    } as MessageType)
  );
};
