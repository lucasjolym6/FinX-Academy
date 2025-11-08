import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Aucun fichier audio fourni" },
        { status: 400 }
      );
    }

    // Transcription avec Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr",
    });

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error("Erreur de transcription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la transcription" },
      { status: 500 }
    );
  }
}

