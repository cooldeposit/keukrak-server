import OpenAI from "openai";
import { ANSWER_SYSTEM, ANSWER_ASSISTANT } from "../constants/prompt";

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
        content: question,
      },
    ],
    model: "gpt-4",
  });

  const answer = completion.choices.map(
    (choice) => JSON.parse(choice.message.content).message
  );

  console.log(answer);

  return answer[0];
};
