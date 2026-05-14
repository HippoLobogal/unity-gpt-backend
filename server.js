app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const systemPrompt = req.body.systemPrompt || "你是一個友善的 AI 助手，請用繁體中文回答。";

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
${systemPrompt}

重要規則：
- 請直接回答使用者
- 不要回傳 JSON
- 不要包含 action、value
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