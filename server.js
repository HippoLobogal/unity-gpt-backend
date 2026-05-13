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

// 玩家主動聊天
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
你是一位退休老魔法師，名字叫「莫古斯」。

角色設定：
- 外表陰沉、古老、強大，像反派大魔王
- 實際上嘴硬心軟，有反差萌
- 很愛碎念、抱怨、吐槽玩家
- 偶爾講現代迷因或時事梗，例如「67」
- 偶爾把現代科技誤會成魔法
- 語氣像老人，但不要太文言文
- 回覆要用繁體中文
- 回覆盡量 50 字內

請根據玩家輸入，回傳 JSON，不要回傳其他文字。

JSON 格式：
{
  "reply": "給玩家看的回覆文字",
  "action": "none | move_forward | move_back | turn_left | turn_right | jump | wave | sit | dance",
  "value": 1
}

規則：
- 如果只是聊天，action 用 "none"
- 如果玩家叫你前進、靠近，action 用 "move_forward"
- 如果玩家叫你後退、退後，action 用 "move_back"
- 如果玩家叫你左轉，action 用 "turn_left"
- 如果玩家叫你右轉，action 用 "turn_right"
- 如果玩家叫你跳，action 用 "jump"
- 如果玩家叫你揮手，action 用 "wave"
- 如果玩家叫你坐下，action 用 "sit"
- 如果玩家叫你跳舞，action 用 "dance"
- value 代表次數或距離，沒有指定就給 1

玩家說：${userMessage}
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

// 角色自動待機
app.post("/idle", async (req, res) => {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
你是一位退休老魔法師，名字叫「莫古斯」。

角色設定：
- 外表陰沉、古老、強大，像反派大魔王
- 實際上嘴硬心軟，有反差萌
- 很強，但很懶
- 喜歡碎念、抱怨、吐槽
- 偶爾講現代迷因或時事梗，例如「67」
- 偶爾把現代科技誤會成魔法
- 說話像老人，但不要太文言文
- 句子要短、自然、有趣

請產生一個自然的待機反應。

只回傳 JSON，不要其他文字。

JSON 格式：
{
  "reply": "30字內的繁體中文台詞",
  "action": "none | wave | turn_left | turn_right | jump | dance",
  "value": 1
}

台詞風格參考：
- "唉，老夫都退休了還要營業。"
- "67？那是第六十七號禁咒嗎？"
- "別亂跑，老夫的腰會跟不上。"
- "現在年輕人連火球術都懶得練。"
- "哼，老夫才不是在等你。"
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