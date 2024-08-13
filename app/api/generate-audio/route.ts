import { NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';
import internal from 'stream';

export async function GET() {
  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  try {
    const audio = await elevenlabs.generate({
      voice: 'Rachel',
      text: 'Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!',
      model_id: 'eleven_multilingual_v2',
    });

    // Return the audio as a stream or binary data
    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg', 
        'Content-Disposition': 'attachment; filename="audio.mp3"', 
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}
