import { NextResponse } from "next/server";
import { getOpenAI, systemPrompt, defaultModel } from "@/lib/openai";

export async function POST(req: Request) {
  const body = await req.json();
  const { profile, targetRole } = body || {};
  const client = getOpenAI();
  if (!client)
    return NextResponse.json({
      gaps: ["System design", "Cloud security"],
      note: "Set OPENAI_API_KEY for detailed analysis.",
    });
  const prompt = `Profile: ${JSON.stringify(profile)} Target role: ${targetRole}. List top skill gaps and learning plan.`;
  const res = await client.responses.create({
    model: defaultModel,
    input: [
      { role: "system", content: systemPrompt("Identify gaps and propose training plan") },
      { role: "user", content: prompt },
    ],
  });
  return NextResponse.json({ plan: res.output_text });
}