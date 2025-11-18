import OpenAI from "openai";

const baseURL = process.env.OPENAI_API_BASE || "https://openrouter.ai/api/v1";
export const defaultModel = process.env.OPENAI_MODEL || "openai/gpt-oss-20b:free";

export const getOpenAI = () => {
  const key = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key, baseURL });
};

export const systemPrompt = (goal: string) =>
  `You are an expert career assistant. ${goal}. Respond concisely.`;