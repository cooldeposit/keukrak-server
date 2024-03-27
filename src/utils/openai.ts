import OpenAI from "openai";
import {
  ANSWER_SYSTEM,
  ANSWER_ASSISTANT,
  ANSWER_USER,
  TEST_CONVERSATION,
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
    model: "gpt-4",
  });

  const answer = completion.choices.map((choice) => choice.message.content);

  return answer[0].replace(/"/g, "").trim();
};

export const checkConversation = async (
  concept: string,
  question: string,
  chats: { name: string; text: string }[],
  aiNickname: string
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: CHECK_CONVERSATION(concept, question, chats, aiNickname),
      },
    ],
    model: "gpt-4",
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
    model: "gpt-3.5-turbo",
  });

  const answer = completion.choices.map((choice) => choice.message.content);

  return answer[0].replace(/"/g, "").trim();
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
        content: TEST_CONVERSATION(concept, question, chats, aiNickname),
      },
    ],
    model: "gpt-4",
  });

  const answer = completion.choices.map((choice) => choice.message.content);

  console.log(TEST_CONVERSATION(concept, question, chats, aiNickname));

  return answer[0].replace(/"/g, "").trim();
};
