import { NextResponse } from "next/server";
import { getOpenAI, systemPrompt, defaultModel } from "@/lib/openai";

export async function POST(req: Request) {
  const body = await req.json();
  const { role, transcript } = body || {};
  const client = getOpenAI();
  if (!client)
    return NextResponse.json({
      reply: "Provide role and your answer. Set OPENAI_API_KEY for interactive coaching.",
    });
  const prompt = `Role: ${role}. Candidate answer: ${transcript}. Give coaching feedback and a stronger sample answer.`;
  const res = await client.chat.completions.create({
    model: defaultModel,
    messages: [
      { role: "system", content: systemPrompt("Be a pragmatic interview coach") },
      { role: "user", content: prompt },
    ],
  });
  return NextResponse.json({ reply: res.choices?.[0]?.message?.content ?? "" });
}