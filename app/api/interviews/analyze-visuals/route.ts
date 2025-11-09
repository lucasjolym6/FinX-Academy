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
            {
              type: "input_text",
              text: prompt,
            },
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
    } as any);

    let visualFeedback: unknown = null;
    const messageOutput = response?.output?.find(
      (item) => item.type === "message"
    ) as { type: "message"; content: Array<any> } | undefined;

    const contents: Array<any> | undefined = messageOutput?.content;

    if (Array.isArray(contents)) {
      for (const item of contents) {
        if (item?.type === "json_schema" && item.json) {
          visualFeedback = item.json;
          break;
        }
        if (item?.type === "output_text" && typeof item.text === "string") {
          try {
            visualFeedback = JSON.parse(item.text);
          } catch (error) {
            console.error("Parse visual feedback output_text", error, item.text.slice(0, 200));
          }
          break;
        }
      }
    }

    if (!visualFeedback && Array.isArray(response?.output_text) && response.output_text.length > 0) {
      const joined = response.output_text.join("\n");
      try {
        visualFeedback = JSON.parse(joined);
      } catch (error) {
        console.error("Parse visual feedback fallback", error, joined.slice(0, 200));
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


