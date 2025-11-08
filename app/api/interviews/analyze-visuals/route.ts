import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const visualSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    attire: { type: "string" },
    posture: { type: "string" },
    eyeContact: { type: "string" },
    facialExpression: { type: "string" },
    environment: { type: "string" },
    confidenceLevel: { type: "string" },
    riskFlags: {
      type: "array",
      items: { type: "string" },
    },
    tips: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "summary",
    "attire",
    "posture",
    "eyeContact",
    "facialExpression",
    "confidenceLevel",
    "tips",
  ],
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const frameDataUrl = body?.frameDataUrl as string | undefined;

    if (!frameDataUrl) {
      return NextResponse.json({ error: "frameDataUrl manquant" }, { status: 400 });
    }

    const base64Match = frameDataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!base64Match) {
      return NextResponse.json({ error: "Format image invalide" }, { status: 400 });
    }

    const [, mimeType, base64Image] = base64Match;

    const prompt = `Tu es un expert en communication non-verbale pour entretiens financiers. Analyse sans complaisance la tenue, la posture, le regard, l'expression faciale et l'environnement. Signale les risques (tenue inadaptée, regard fuyant, posture crispée, décor brouillon...) et propose des actions concrètes à mettre en œuvre immédiatement. Ton retour doit être précis, synthétique et orienté performance.`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "input_image",
              image_base64: base64Image,
              mime_type: mimeType,
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "visual_feedback",
          schema: visualSchema,
        },
      },
    });

    let rawText = "";
    if (Array.isArray(response.output) && response.output.length > 0) {
      const firstOutput = response.output[0];
      if (firstOutput.content && firstOutput.content.length > 0) {
        const maybeText = firstOutput.content.find((item: any) => item.type === "output_text");
        if (maybeText && typeof maybeText.text === "string") {
          rawText = maybeText.text;
        }
      }
    }

    if (!rawText && Array.isArray(response.output_text) && response.output_text.length > 0) {
      rawText = response.output_text.join("\n");
    }

    let visualFeedback: any = null;
    if (rawText) {
      try {
        visualFeedback = JSON.parse(rawText);
      } catch (error) {
        console.error("Parse visual feedback", error, rawText.slice(0, 200));
      }
    }

    if (!visualFeedback || typeof visualFeedback !== "object") {
      visualFeedback = {
        summary: "Analyse visuelle indisponible (capture ou traitement impossible).",
        attire: "",
        posture: "",
        eyeContact: "",
        facialExpression: "",
        environment: "",
        confidenceLevel: "",
        riskFlags: [],
        tips: [],
      };
    }

    return NextResponse.json({ visualFeedback });
  } catch (error) {
    console.error("Erreur analyse visuelle", error);
    return NextResponse.json({ error: "Erreur pendant l'analyse visuelle" }, { status: 500 });
  }
}


