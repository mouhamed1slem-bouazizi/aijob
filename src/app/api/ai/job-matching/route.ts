import { NextResponse } from "next/server";
import { getOpenAI, systemPrompt, defaultModel } from "@/lib/openai";

export async function POST(req: Request) {
  const body = await req.json();
  const { profile, preferences } = body || {};
  const client = getOpenAI();
  if (!client)
    return NextResponse.json(
      {
        matches: [
          {
            title: "Frontend Engineer",
            company: "Example Co",
            matchReason: "Strong React/Next.js skills",
            link: "https://jobs.example.com/frontend",
          },
        ],
        note: "Set OPENAI_API_KEY to enable AI-powered matching.",
      },
      { status: 200 }
    );

  const prompt = `Candidate profile: ${JSON.stringify(profile)}. Preferences: ${JSON.stringify(
    preferences
  )}. Recommend 5 matching roles as JSON array with fields title, company, matchReason, link.`;
  const res = await client.chat.completions.create({
    model: defaultModel,
    messages: [
      { role: "system", content: systemPrompt("Recommend roles based on skills and experience") },
      { role: "user", content: prompt },
    ],
  });
  const text = res.choices?.[0]?.message?.content ?? "";
  try {
    const matches = JSON.parse(text);
    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ raw: text });
  }
}