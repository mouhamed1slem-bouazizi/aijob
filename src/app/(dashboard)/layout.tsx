"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import Link from "next/link";
import { signOutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-dvh grid grid-cols-[200px_1fr]">
        <aside className="border-r p-4 space-y-2">
          <div className="font-semibold">Career Assistant</div>
          <nav className="grid gap-2 text-sm">
            <Link href="/dashboard">Overview</Link>
            <Link href="/job-matching">Job Matching</Link>
            <Link href="/cv-optimizer">CV Optimization</Link>
            <Link href="/interview-prep">Interview Prep</Link>
            <Link href="/skill-gap">Skill Gap Analysis</Link>
            <Link href="/applications">Applications</Link>
          </nav>
          <Button variant="outline" onClick={() => signOutUser()}>Sign out</Button>
        </aside>
        <main className="p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}