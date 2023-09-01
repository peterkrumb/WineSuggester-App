import openai from "./api.js";
import { prompt } from "./prompt.js";

const generate = async (queryDescription) => {
  // console.log("Prompt sent to OpenAI API:", prompt);
  console.log("Prompt sent to OpenAI API:", queryDescription);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          "Hello! I'm in the mood for a nice bottle of wine. Can you help me find the perfect one?",
      },
      {
        role: "system",
        content:
          "Of course! As your friendly wine recommender bot, I'm here to assist you. Please provide me with some details to tailor the recommendation to your taste. Let's start with the following: 1. What type of wine do you prefer? Red, white, or sparkling? 2. Are you looking for something sweet, dry, or in between? 3. Do you have any specific grape varieties in mind? If not, I can suggest some popular ones. 4. What is your preferred price range? This will help me narrow down the options. And how would you like the body of the wine to be? Light, medium, or full-bodied?",
      },
      {
        role: "user",
        content: queryDescription,
      },
      {
        role: "system",
        content:
          "Start with 'Wine Recommendation [number]:'Provide the name of the wine. Include a sentence starting with 'Description:', offering a captivating description of the wine. Follow with a sentence starting with 'Price:', indicating the wine's price range. Conclude with a sentence starting with 'Reason:', detailing why this wine was chosen. Each of these points should be on a new line for clarity. Here's an example for reference: Wine Recommendation: Descendientes de J. Palacios Pétalos Mencia Description: Pétalos is a fantastic representation of Mencia from the Bierzo region. It displays a beautiful deep purple color and exudes aromas of blackberries, violets, and a touch of smokiness. Price: $25 Reason: It is a great value wine that showcases the elegance and complexity of Mencia.",
      },
    ],
    // max_tokens: 1000,
    temperature: 0.7,
  });
  console.log("Response received:", JSON.stringify(response, null, 2));
  return response.data.choices[0].message.content;
};

export default generate;
