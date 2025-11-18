"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function InterviewPrepPage() {
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const onCoach = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/interview-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, transcript: answer }),
    });
    const data = await res.json();
    setReply(data.reply || "");
    setLoading(false);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Interview Prep</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Textarea placeholder="Your answer to a question" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <Button onClick={onCoach} disabled={loading}>{loading ? "Coaching..." : "Get feedback"}</Button>
        </CardContent>
      </Card>
      {reply && (
        <Card>
          <CardHeader>
            <CardTitle>Coach Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">{reply}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}