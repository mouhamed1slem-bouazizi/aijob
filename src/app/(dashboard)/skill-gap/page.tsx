"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SkillGapPage() {
  const [profile, setProfile] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const onAnalyze = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/skill-gap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, targetRole }),
    });
    const data = await res.json();
    setPlan(data.plan ? data.plan : JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Target role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
          <Textarea placeholder="Your skills and background" value={profile} onChange={(e) => setProfile(e.target.value)} />
          <Button onClick={onAnalyze} disabled={loading}>{loading ? "Analyzing..." : "Analyze"}</Button>
        </CardContent>
      </Card>
      {plan && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">{plan}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}