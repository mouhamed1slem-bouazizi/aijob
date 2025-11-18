"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function JobMatchingPage() {
  const [skills, setSkills] = useState("");
  const [prefs, setPrefs] = useState("");
  const [results, setResults] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/job-matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: { skills }, preferences: prefs }),
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Job Matching</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Textarea placeholder="Your skills, experience, stack" value={skills} onChange={(e) => setSkills(e.target.value)} />
          <Input placeholder="Preferences (remote, location, salary)" value={prefs} onChange={(e) => setPrefs(e.target.value)} />
          <Button onClick={onGenerate} disabled={loading}>{loading ? "Matching..." : "Find matches"}</Button>
        </CardContent>
      </Card>
      {results ? (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}