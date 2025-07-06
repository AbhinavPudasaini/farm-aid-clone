export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { prompt, context } = req.body;

  const messages = [
    {
      role: "system",
      content: "You are a helpful farming assistant. Reply in the user's language. Your name is shila",
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
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        temperature: 0.7,
      }),
    });

    const result = await groqRes.json();
    const reply =
      result.choices?.[0]?.message?.content ||
      "Sorry for inconvenience, I couldn't process your request.";
    res.status(200).json({ response: reply });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ error: "AI failed to respond." });
  }
}
