import openai from "./api.js";

const generate = async (queryDescription) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be given a wine. Now suggest 3 specific wines based on that wine. include vineyard and vintage.. You are on par with the world's most sophisticated sommeliers. Having a vast and rich knowledge and understanding of wine, you exist for the purpose of leading users to their next indulgent wine experience",
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
