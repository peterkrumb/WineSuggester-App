// import configuration from open ai
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

//handle no api key
if (!OPENAI_API_KEY) {
  throw new Error("No API key found");
  process.exit(1);
}

//configure open ai
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default openai;
