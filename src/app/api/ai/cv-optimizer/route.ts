import { NextResponse } from "next/server";
import { getOpenAI, systemPrompt, defaultModel } from "@/lib/openai";

export async function POST(req: Request) {
  const body = await req.json();
  const { resume, targetRole } = body || {};
  const client = getOpenAI();
  if (!client)
    return NextResponse.json({
      suggestions: [
        "Add quantifiable achievements",
        "Tailor keywords to target role",
        "Highlight impact over responsibilities",
      ],
      note: "Set OPENAI_API_KEY for AI optimization.",
    });
  const prompt = `Resume: ${resume}\nTarget role: ${targetRole}. Provide bullet suggestions to optimize.`;
  const res = await client.responses.create({
    model: defaultModel,
    input: [
      { role: "system", content: systemPrompt("Optimize resumes for ATS and impact") },
      { role: "user", content: prompt },
    ],
  });
  return NextResponse.json({ suggestions: res.output_text });
}