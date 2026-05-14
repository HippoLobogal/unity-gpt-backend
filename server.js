import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Unity GPT Backend Running!");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const systemPrompt =
      req.body.systemPrompt || "你是一個友善的 AI 助手，請用繁體中文回答。";

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
${systemPrompt}

重要規則：
- 請直接回答使用者
- 不要回傳 JSON
- 不要包含 reply、action、value
- 不要使用 Markdown code block

使用者說：
${userMessage}
`
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});