import express from "express";
import cors from "cors";
import generate from "./generate.js";

const app = express();

var corsOptions = {
  origin:
    "https://64c33d3c7b3da138f43bf98e--lively-rugelach-3e0149.netlify.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    "Origin",
    "X-Api-Key",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/generate", async (req, res) => {
  const queryDescription = req.body.queryDescription;
  try {
    const sqlQuery = await generate(queryDescription);
    res.json({ response: sqlQuery });
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: "Error generating response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
