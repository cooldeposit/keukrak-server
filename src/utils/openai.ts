import OpenAI from "openai";
import {
  ANSWER_SYSTEM,
  ANSWER_ASSISTANT,
  ANSWER_USER,
} from "../constants/prompt";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getAnswer = async (concept: string, question: string) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: ANSWER_SYSTEM(concept),
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

  console.log(answer[0]);

  return answer[0].replace(/"/g, "").trim();
};
