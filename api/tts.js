export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const ELEVEN_API_KEY = "sk_5ebb44045511ff7d9189f24a20b904c90390b426f8016241";
  const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

  const { text } = req.body;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_API_KEY,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.byteLength);
    res.setHeader("Cache-Control", "no-cache");

    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("🛑 TTS Error:", error);
    res.status(500).send("TTS API failed");
  }
}
