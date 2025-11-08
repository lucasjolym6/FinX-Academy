import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const interviewFeedbackSchema = {
  type: "object",
  properties: {
    globalScore: { type: "number", minimum: 0, maximum: 100 },
    verdict: { type: "string" },
    riskLevel: { type: "string", enum: ["faible", "modéré", "élevé"] },
    scores: {
      type: "object",
      properties: {
        pertinenceTechnique: { type: "number", minimum: 0, maximum: 100 },
        clarte: { type: "number", minimum: 0, maximum: 100 },
        confianceOrale: { type: "number", minimum: 0, maximum: 100 },
        vocabulaireProfessionnel: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["pertinenceTechnique", "clarte", "confianceOrale", "vocabulaireProfessionnel"],
    },
    perQuestion: {
      type: "array",
      items: {
        type: "object",
        properties: {
          questionIndex: { type: "number" },
          estimatedScore: { type: "number", minimum: 0, maximum: 100 },
          strengths: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
          weaknesses: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
          missingElements: {
            type: "array",
            items: { type: "string" },
          },
          recommendedActions: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
        },
        required: ["questionIndex", "estimatedScore", "strengths", "weaknesses", "recommendedActions"],
      },
    },
    pointsForts: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
    },
    pointsAmelioration: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
    },
    suggestions: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
    },
    commentaireGeneral: { type: "string" },
  },
  required: [
    "globalScore",
    "verdict",
    "riskLevel",
    "scores",
    "perQuestion",
    "pointsForts",
    "pointsAmelioration",
    "suggestions",
    "commentaireGeneral",
  ],
} as const;

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, questions, transcriptions } = await request.json();

    if (
      typeof jobTitle !== "string" ||
      !Array.isArray(questions) ||
      !Array.isArray(transcriptions)
    ) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    const qaText = questions
      .map((q: string, i: number) => {
        const answer = typeof transcriptions[i] === "string" ? transcriptions[i] : "(Pas de réponse)";
        return `Question ${i + 1}: ${q}\nRéponse: ${answer}`;
      })
      .join("\n\n");

    const prompt = `Tu es un évaluateur RH exigeant spécialisé en finance d'entreprise. Tu dois juger sans complaisance le niveau du candidat, identifier ce qui manque et proposer un plan concret de progrès. Pour chaque question, tu dois distinguer points solides, faiblesses majeures, éléments non traités et actions précises à mener avant un entretien réel. Le ton doit être professionnel, direct et orienté performance. Voici les questions/réponses :\n\n${qaText}`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "Tu es un jury de recrutement finance très rigoureux. Tu détectes les failles et hiérarchises les risques. Tu formules des recommandations actionnables et mesurables.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
          ],
        },
      ],
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "interview_feedback",
          schema: interviewFeedbackSchema,
        },
      },
    } as any);

    let feedback: unknown = null;

    const messageOutput = response?.output?.find(
      (item) => item.type === "message"
    ) as { type: "message"; content: Array<any> } | undefined;

    const contents: Array<any> | undefined = messageOutput?.content;

    if (Array.isArray(contents)) {
      for (const item of contents) {
        if (item?.type === "json_schema" && item.json) {
          feedback = item.json;
          break;
        }
        if (item?.type === "output_text" && typeof item.text === "string") {
          try {
            feedback = JSON.parse(item.text);
          } catch (error) {
            console.error("Parse analyse entretien output_text", error, item.text);
            feedback = null;
          }
          break;
        }
      }
    }

    if (!feedback && Array.isArray(response?.output_text) && response.output_text.length > 0) {
      const joined = response.output_text.join("\n");
      try {
        feedback = JSON.parse(joined);
      } catch (error) {
        console.error("Parse analyse entretien fallback", error, joined);
        feedback = null;
      }
    }

    if (!feedback || typeof feedback !== "object") {
      return NextResponse.json(
        {
          error: "Analyse indisponible",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Erreur d'analyse:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}

