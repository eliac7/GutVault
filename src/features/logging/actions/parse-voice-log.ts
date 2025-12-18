"use server";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";

import { z } from "zod";
import { SYMPTOM_LABELS, TRIGGER_FOOD_LABELS } from "@/shared/db";
import { SpeechLanguageCode } from "../hooks/use-speech-recognition";

const MODEL = process.env.OPENROUTER_MODEL || "mistralai/devstral-2512:free";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
const chatModel = openrouter.chat(MODEL);

const logEntrySchema = z.object({
  type: z
    .enum(["bowel_movement", "meal", "symptom", "medication"])
    .describe("The type of log entry based on what the user described"),
  bristolType: z
    .number()
    .min(1)
    .max(7)
    .optional()
    .describe(
      "Bristol stool scale type 1-7 if mentioned. Type 1-2 = constipation, 3-4 = normal, 5-7 = diarrhea"
    ),
  painLevel: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .describe("Pain level from 1-10 if mentioned"),
  symptoms: z
    .array(z.enum(SYMPTOM_LABELS))
    .optional()
    .describe("Any symptoms mentioned by the user"),
  foods: z
    .array(z.string())
    .optional()
    .describe("Any foods or meals mentioned"),
  triggerFoods: z
    .array(z.enum(Object.keys(TRIGGER_FOOD_LABELS)))
    .optional()
    .describe("Known trigger food categories if the foods fall into them"),
  medication: z.string().optional().describe("Any medication mentioned"),
  notes: z
    .string()
    .optional()
    .describe("Any additional context or notes from the transcript"),
});

export type ParsedLogEntry = z.infer<typeof logEntrySchema>;

export async function parseVoiceLog(
  transcript: string,
  language: SpeechLanguageCode
): Promise<
  { success: true; data: ParsedLogEntry } | { success: false; error: string }
> {
  if (!transcript.trim()) {
    return { success: false, error: "Empty transcript" };
  }

  try {
    const { object } = await generateObject({
      model: chatModel,
      schema: logEntrySchema,
      system: `You are a health tracking assistant for an IBS (Irritable Bowel Syndrome) app called GutVault.
Your job is to parse natural language voice logs from users into structured health data.

The user spoke in ${language}, so consider regional language variations and colloquialisms when parsing.
IMPORTANT: Respond in the same language as the user's input. If the user speaks in Greek, provide notes and any textual content in Greek. If they speak in English, respond in English.

Context about IBS tracking:
- Bristol Stool Scale: Type 1 (hard lumps) to Type 7 (watery). Types 3-4 are considered normal.
- Pain levels: 1-10 scale where 1 is minimal and 10 is severe
- Common IBS symptoms: bloating, cramping, gas, nausea, urgency, incomplete evacuation
- Common trigger foods: dairy, gluten, caffeine, alcohol, spicy foods, fatty foods

Be helpful and extract as much relevant information as possible from the user's description.
If they mention going to the bathroom, it's likely a bowel_movement log.
If they mention eating or drinking, it's likely a meal log.
If they only mention how they feel without food/bathroom context, it's a symptom log.`,
      prompt: `Parse this voice log from a user tracking their IBS symptoms:

"${transcript}"

Extract all relevant health information mentioned.`,
    });

    return { success: true, data: object };
  } catch (error) {
    console.error("Failed to parse voice log:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to parse voice log",
    };
  }
}
