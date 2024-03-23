import WebSocket from "ws";
import { MessageType, NicknameType } from "../types/message";

const url = `ws://${process.env.APP_HOST}/api/ws`;

const ws = new WebSocket(url);

export const initWebSocket = () => {
  ws.on("open", () => {
    console.log("WebSocket connected");
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
  });
};

export const sendAdmin = (message: string, id: string) => {
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
