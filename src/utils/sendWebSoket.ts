import WebSocket from "ws";
import { MessageType, NicknameType } from "../types/message";
import { ADMIN_NICKNAME } from "../constants/admin";

export const sendAdmin = (message: string, id: string) => {
  /* ws.send(
    JSON.stringify({
      type: "message",
      id,
      payload: {
        nickname: ADMIN_NICKNAME,
        content: message,
      },
    } as MessageType)
  ); */
};

export const sendAI = (
  message: string,
  id: string,
  aiNickname: NicknameType
) => {
  /*  ws.send(
    JSON.stringify({
      type: "message",
      id,
      payload: {
        nickname: aiNickname,
        content: message,
      },
    } as MessageType)
  ); */
};
