import openai from "./api.js";
import { prompt } from "./prompt.js";

const generate = async (queryDescription) => {
  console.log("Prompt sent to OpenAI API:", queryDescription);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: queryDescription,
      },
    ],
    // max_tokens: 1000,
    temperature: 0.7,
  });

  return response.data.choices[0].message.content;
};

export default generate;
