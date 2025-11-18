"use client";
import { listenAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = listenAuth((user) => {
      if (!user) router.replace("/sign-in");
      else setReady(true);
    });
    return () => unsub();
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}