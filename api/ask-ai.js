// llama-groq.js (ES Module style)
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export async function askLlama(message) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a helpful farming assistant who gives practical and concise answers. Your name is lila." },
        { role: "user", content: message }
      ],
      temperature: 0.7
    })
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "Sorry, something went wrong.";
}

