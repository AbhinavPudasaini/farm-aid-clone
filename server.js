import dotenv from "dotenv";
dotenv.config();
import express, { response } from "express";
import fetch from "node-fetch";
import cors from "cors";
import ttsRouter from "./tts.js"; 



const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Groq + LLaMA 3 chat endpoint
app.post("/api/ask-ai", async (req, res) => {
  const { prompt, context } = req.body;

  const messages = [
    {
      role: "system",
      content: `You are FarmAid, an AI assistant designed to help farmers all over the world. Provide simple, practical, and localized farming advice based on regional weather, crop trends, and market prices. Answer in a friendly and encouraging tone.

You can assist with:
- Crop selection based on season and location
- Pest and disease identification and treatment
- Organic and chemical fertilizer guidance
- Best times for sowing, irrigation, and harvesting
- Government schemes, subsidies, and insurance
- Local market prices and farming news

Always explain in simple terms that a rural farmer can understand. If an image is uploaded, assume it's for crop diagnosis unless specified.

        `,
    },
    {
      role: "user",
      content: `${context}\n\nUser question: ${prompt}`,
    },
  ];


  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        temperature: 0.7,
      }),
    });

    const result = await groqRes.json();
    const reply = result.choices?.[0]?.message?.content || "Sorry for inconvenience, I couldn't process your request.";
    res.json({ response: reply });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ error: "AI failed to respond." });
  }
});

// 🔊 TTS route
app.use("/api", ttsRouter);

// ✅ Start the server
app.listen(5000, () => {
    // console.log("🧪 ENV:", process.env);

  console.log("✅ FarmAid AI server running at http://localhost:5000");
});


