import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <main className="w-full max-w-2xl p-8 text-center space-y-6">
        <h1 className="text-3xl font-semibold">AI Job Search & Career Assistant</h1>
        <p className="text-muted-foreground">
          Intelligent job matching, CV optimization, interview prep, skill gap analysis,
          and application tracking powered by AI.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link href="/sign-in">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">Create Account</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
