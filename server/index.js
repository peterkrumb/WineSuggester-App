import express from "express";
import cors from "cors";
import generate from "./generate.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://64c3f716a5096d1d56f67a47--lively-rugelach-3e0149.netlify.app",
  "https://lively-rugelach-3e0149.netlify.app",
];
cd;
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());

// This line will ensure that all OPTIONS requests have CORS headers
app.options("*", cors(corsOptions));

// Use cors middleware for your other routes
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
