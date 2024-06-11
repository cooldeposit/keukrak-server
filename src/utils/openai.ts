import OpenAI from "openai";
import {
  ANSWER_SYSTEM,
  ANSWER_ASSISTANT,
  ANSWER_USER,
  CHECK_CONVERSATION,
  QUESTION_CONVERSATION,
} from "../constants/prompt";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getAnswer = async (
  concept: string,
  question: string,
  example: string[]
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: ANSWER_SYSTEM(concept, example),
      },
      {
        role: "assistant",
        content: ANSWER_ASSISTANT(),
      },
      {
        role: "user",
        content: ANSWER_USER(question),
      },
    ],
    model: "gpt-4o",
  });

  const answer = completion.choices.map((choice) => choice.message.content);

  return answer[0].replace(/"/g, "").trim();
};

export const checkConversation = async (
  chats: { name: string; text: string }[],
  aiNickname: string
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: CHECK_CONVERSATION(chats, aiNickname),
      },
    ],
    model: "gpt-4o",
  });

  const answer = completion.choices.map((choice) => choice.message.content);
  console.log(
    `${JSON.stringify(
      chats.map((chat) => `${chat.name}: ${chat.text}`).join(`
      `)
    )}`
  );

  return answer[0].replace(/"/g, "").trim();
};

export const questionConversation = async (
  concept: string,
  question: string,
  chats: { name: string; text: string }[],
  aiNickname: string
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: QUESTION_CONVERSATION(concept, question, chats, aiNickname),
      },
    ],
    model: "gpt-4o",
  });

  const answer = completion.choices.map((choice) => choice.message.content);

  return answer[0]
    .replace(/"/g, "")
    .trim()
    .replace(Math.random() > 0.3 ? "." : "", "")
    .replace(/'/g, "");
};

export const getConversation = async (
  concept: string,
  question: string,
  chats: { name: string; text: string }[],
  aiNickname: string
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: QUESTION_CONVERSATION(concept, question, chats, aiNickname),
      },
    ],
    model: "gpt-4o",
  });

  const answer = completion.choices.map((choice) => choice.message.content);

  console.log(QUESTION_CONVERSATION(concept, question, chats, aiNickname));

  return answer[0]
    .replace(/"/g, "")
    .trim()
    .replace(Math.random() > 3 ? "." : "", "")
    .replace(/'/g, "");
};
