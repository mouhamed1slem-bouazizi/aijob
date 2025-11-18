import { getDb } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

export interface Application {
  title: string;
  company: string;
  url?: string;
}

export async function addApplication(uid: string, app: Application) {
  return addDoc(collection(getDb(), "applications"), { uid, ...app, createdAt: Timestamp.now() });
}

export async function listApplications(uid: string): Promise<(Application & { id: string })[]> {
  const q = query(collection(getDb(), "applications"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Application) }));
}