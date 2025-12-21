"use server";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";

const MODEL = process.env.OPENROUTER_MODEL || "mistralai/devstral-2512:free";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
const chatModel = openrouter.chat(MODEL);

const foodAnalysisSchema = z.object({
  name: z.string().describe("The English name of the food (normalized)"),
  status: z.enum(["low", "medium", "high"]).describe("The FODMAP status"),
  category: z.string().optional().describe("The food category (e.g., Vegetable, Fruit, Dairy)"),
  notes: z.string().optional().describe("Brief explanation of why it has this status (e.g., 'High in fructans')"),
});

export type FoodAnalysisResult = z.infer<typeof foodAnalysisSchema>;

export async function analyzeFood(
  foodName: string,
  language: string = "English"
): Promise<{ success: true; data: FoodAnalysisResult } | { success: false; error: string }> {
  if (!foodName.trim()) {
    return { success: false, error: "Empty food name" };
  }

  try {
    const { object } = await generateObject({
      model: chatModel,
      schema: foodAnalysisSchema,
      system: `You are a nutrition expert specializing in the Low FODMAP diet for IBS. 
Your task is to analyze a given food item name (which might be in any language) and determine its FODMAP content.

1. Identify the food item based on the provided name and language context.
2. Translate the food name to English (normalized) for the output 'name' field.
3. Determine if it is Low, Medium, or High FODMAP.
4. Provide a brief category and reason.

Standard references:
- Monash University FODMAP Diet
- Common IBS trigger foods`,
      prompt: `Analyze the FODMAP status of: "${foodName}" (Language context: ${language})`,
    });

    return { success: true, data: object };
  } catch (error) {
    console.error("Failed to analyze food:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze food",
    };
  }
}
