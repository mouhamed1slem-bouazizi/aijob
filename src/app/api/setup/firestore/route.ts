import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export async function POST() {
  const db = getDb();
  await setDoc(doc(db, "users", "__init__"), { createdAt: Timestamp.now() });
  await setDoc(doc(db, "profiles", "__init__"), { updatedAt: Timestamp.now() });
  await setDoc(doc(db, "jobs", "__init__"), { postedAt: Timestamp.now() });
  await setDoc(doc(db, "saved_jobs", "__init__"), { savedAt: Timestamp.now() });
  await setDoc(doc(db, "applications", "__init__"), { createdAt: Timestamp.now() });
  await setDoc(doc(db, "interview_sessions", "__init__"), { createdAt: Timestamp.now() });
  await setDoc(doc(db, "cvs", "__init__"), { updatedAt: Timestamp.now() });
  await setDoc(doc(db, "skill_gap_analyses", "__init__"), { createdAt: Timestamp.now() });
  return NextResponse.json({ ok: true });
}