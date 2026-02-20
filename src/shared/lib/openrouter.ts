import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { extractJsonMiddleware, wrapLanguageModel } from "ai";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "z-ai/glm-4.5-air:free";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY?.trim();

if (!OPENROUTER_KEY) {
  throw new Error("Missing OPENROUTER_KEY environment variable");
}

const openrouter = createOpenRouter({
  apiKey: OPENROUTER_KEY,
});

export const chatModel = wrapLanguageModel({
  model: openrouter.chat(OPENROUTER_MODEL),
  middleware: extractJsonMiddleware(),
});
