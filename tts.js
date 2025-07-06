import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env here too

const router = express.Router();

const ELEVEN_API_KEY = "sk_5ebb44045511ff7d9189f24a20b904c90390b426f8016241";
console.log("🔑 ElevenLabs API Key Loaded:", ELEVEN_API_KEY?.slice(0, 5));

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

router.post('/tts', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_API_KEY,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength,
      'Cache-Control': 'no-cache',
    });

    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("🛑 TTS Error:", error);
    res.status(500).send("TTS API failed");
  }
});

export default router;
