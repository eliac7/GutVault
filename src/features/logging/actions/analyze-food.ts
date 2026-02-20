"use server";

import { generateText, Output } from "ai";
import { z } from "zod";
import { chatModel } from "@/shared/lib/openrouter";
import { checkRateLimit } from "../lib/rate-limit";
import type { RateLimitError } from "../lib/rate-limit-config";

const foodAnalysisSchema = z.object({
  name: z.string().describe("The English name of the food (normalized)"),
  status: z.enum(["low", "medium", "high"]).describe("The FODMAP status"),
  category: z
    .string()
    .optional()
    .describe("The food category (e.g., Vegetable, Fruit, Dairy)"),
  notes: z
    .string()
    .optional()
    .describe(
      "Brief explanation of why it has this status (e.g., 'High in fructans')",
    ),
});

export type FoodAnalysisResult = z.infer<typeof foodAnalysisSchema>;

export async function analyzeFood(
  foodName: string,
  deviceId: string,
  language: string = "English",
): Promise<
  | { success: true; data: FoodAnalysisResult }
  | { success: false; error: string }
  | RateLimitError
> {
  if (!foodName.trim()) {
    return { success: false, error: "Empty food name" };
  }

  // Check rate limit before processing
  const rateLimitResult = await checkRateLimit(deviceId, "FOOD_ANALYSIS");
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
      output: Output.object({ schema: foodAnalysisSchema }),
      system: `You are a nutrition expert specializing in the Low FODMAP diet for IBS.
Your task is to analyze a given food item name (which might be in any language) and determine its FODMAP content.

1. Identify the food item based on the provided name and language context.
2. Translate the food name to English (normalized) for the output 'name' field.
3. Determine if it is Low, Medium, or High FODMAP.
4. Provide a brief category and reason.

IMPORTANT: You MUST respond with a valid JSON object matching the schema. Do not include any explanatory text outside the JSON structure.

Standard references:
- Monash University FODMAP Diet
- Common IBS trigger foods`,
      prompt: `Analyze the FODMAP status of: "${foodName}" (Language context: ${language})

Return the analysis as a JSON object matching the required schema.`,
    });

    return { success: true, data: output };
  } catch (error) {
    console.error("Failed to analyze food:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze food",
    };
  }
}
