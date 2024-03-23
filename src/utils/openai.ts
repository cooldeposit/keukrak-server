import OpenAI from "openai";
import { ANSWER_SYSTEM, ANSWER_ASSISTANT } from "../constants/prompt";
import "../env";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getAnswer = async ({
  concept,
  question,
}: {
  concept: string;
  question: string;
}) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: ANSWER_SYSTEM(concept, question),
      },
      {
        role: "assistant",
        content: ANSWER_ASSISTANT(),
      },
    ],
    model: "gpt-4",
  });

  const answer = completion.choices.map(
    (choice) => JSON.parse(choice.message.content).message
  );

  return answer[0];
};
