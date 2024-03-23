import WebSocket from "ws";
import { MessageType, NicknameType } from "../types/message";
import { ADMIN_NICKNAME } from "../constants/admin";

import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

const url = `ws://${process.env.APP_HOST}/api/ws`;

console.log(url);

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
