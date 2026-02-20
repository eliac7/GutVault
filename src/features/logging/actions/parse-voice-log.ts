"use server";

import { generateText, Output } from "ai";

import {
  ANXIETY_MARKER_LABELS,
  SYMPTOM_LABELS,
  TRIGGER_FOOD_LABELS,
} from "@/shared/db";
import { chatModel } from "@/shared/lib/openrouter";
import { z } from "zod";
import { SpeechLanguageCode } from "../hooks/use-speech-recognition";
import { checkRateLimit } from "../lib/rate-limit";
import type { RateLimitError } from "../lib/rate-limit-config";

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
      "Bristol stool scale type 1-7 if mentioned. Type 1-2 = constipation, 3-4 = normal, 5-7 = diarrhea",
    ),
  painLevel: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .describe("Pain level from 1-10 if mentioned"),
  stressLevel: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .describe("Stress level from 1-10 if mentioned"),
  symptoms: z
    .array(z.enum(Object.keys(SYMPTOM_LABELS) as [keyof typeof SYMPTOM_LABELS]))
    .optional()
    .describe("Any symptoms mentioned by the user"),
  anxietyMarkers: z
    .array(
      z.enum(
        Object.keys(ANXIETY_MARKER_LABELS) as [
          keyof typeof ANXIETY_MARKER_LABELS,
        ],
      ),
    )
    .optional()
    .describe("Any mental state or anxiety markers mentioned"),
  foods: z
    .array(z.string())
    .optional()
    .describe("Any foods or meals mentioned"),
  triggerFoods: z
    .array(z.enum(Object.keys(TRIGGER_FOOD_LABELS)))
    .optional()
    .describe("Known trigger food categories if the foods fall into them"),
  medication: z.string().optional().describe("Any medication name mentioned"),
  medicationDose: z
    .string()
    .optional()
    .describe("Any medication dose mentioned (e.g., '200mg', '2 tablets')"),
  notes: z
    .string()
    .optional()
    .describe("Any additional context or notes from the transcript"),
});

export type ParsedLogEntry = z.infer<typeof logEntrySchema>;

export async function parseVoiceLog(
  transcript: string,
  language: SpeechLanguageCode,
  deviceId: string,
): Promise<
  | { success: true; data: ParsedLogEntry }
  | { success: false; error: string }
  | RateLimitError
> {
  if (!transcript.trim()) {
    return { success: false, error: "Empty transcript" };
  }

  // Check rate limit before processing
  const rateLimitResult = await checkRateLimit(deviceId, "VOICE_LOG");
  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: "Rate limit exceeded. Please try again later.",
      rateLimit: rateLimitResult,
    };
  }

  try {
    const { output } = await generateText({
      model: chatModel,
      output: Output.object({ schema: logEntrySchema }),
      system: `You are a health tracking assistant for an IBS (Irritable Bowel Syndrome) app called GutVault.
Your job is to parse natural language voice logs from users into structured health data.

The user spoke in ${language}, so consider regional language variations and colloquialisms when parsing.
IMPORTANT: You MUST respond with a valid JSON object matching the schema. Do not include any explanatory text outside the JSON structure.
For text fields like notes, you can use the user's language (Greek or English), but the JSON structure itself must be valid.

Context about IBS tracking:
- Bristol Stool Scale: Type 1 (hard lumps) to Type 7 (watery). Types 3-4 are considered normal.
- Pain levels: 1-10 scale where 1 is minimal and 10 is severe
- Stress levels: 1-10 scale where 1 is relaxed and 10 is extremely stressed
- Common IBS symptoms: bloating, cramping, gas, nausea, urgency, incomplete evacuation
- Anxiety/Mental State markers: calm, nervous, anxious, stressed, overwhelmed, panic, brain_fog, restless
- Common trigger foods: dairy, gluten, caffeine, alcohol, spicy foods, fatty foods, medication

Be helpful and extract as much relevant information as possible from the user's description.
If they mention going to the bathroom, it's likely a bowel_movement log.
If they mention eating or drinking, it's likely a meal log.
If they only mention how they feel without food/bathroom context, it's a symptom log.

CRITICAL: Return ONLY a valid JSON object. Do not include any text before or after the JSON.`,
      prompt: `Parse this voice log from a user tracking their IBS symptoms:

"${transcript}"

Extract all relevant health information mentioned and return it as a JSON object matching the required schema.`,
    });

    return { success: true, data: output };
  } catch (error) {
    console.error("Failed to parse voice log:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to parse voice log",
    };
  }
}
