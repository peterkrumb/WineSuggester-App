import openai from "./api.js";
import { prompt } from "./prompt.js";

const generate = async (queryDescription) => {
  console.log("Prompt sent to OpenAI API:", queryDescription);
  const response = await openai.createChatCompletion({
    model: "gpt-4",
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
    // maxTokens: 1000,
    temperature: 0.3,
  });
  console.log(response.data.choices[0].message.content);
  return response.data.choices[0].message.content;
};

export default generate;
