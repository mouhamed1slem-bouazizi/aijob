"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CVOptimizerPage() {
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const onOptimize = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/cv-optimizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, targetRole: role }),
    });
    const data = await res.json();
    setSuggestions(typeof data.suggestions === "string" ? data.suggestions : JSON.stringify(data.suggestions, null, 2));
    setLoading(false);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>CV Optimization</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Target role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Textarea placeholder="Paste your resume or summary" value={resume} onChange={(e) => setResume(e.target.value)} />
          <Button onClick={onOptimize} disabled={loading}>{loading ? "Optimizing..." : "Optimize"}</Button>
        </CardContent>
      </Card>
      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">{suggestions}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}