export interface NicknameType {
  icon: string;
  name: string;
  color: string;
}

export interface ChatPayloadType {
  nickname: NicknameType;
  content: string;
}

export interface UserPayloadType {
  userId: string;
  username: string;
}

export interface AdminPayloadType {
  content: string;
}

export interface QuestionPayloadType {
  question: string;
}

export interface MessageType {
  type: "message" | "enter" | "leave" | "admin" | "question";
  id: string;
  payload:
    | ChatPayloadType
    | UserPayloadType
    | AdminPayloadType
    | QuestionPayloadType;
}
