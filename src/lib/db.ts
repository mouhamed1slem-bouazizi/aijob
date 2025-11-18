import { getDb } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export interface Application {
  title: string;
  company: string;
  url?: string;
  status?: "applied" | "interview" | "offer" | "rejected" | "accepted" | "wishlist";
  stage?: string;
  appliedAt?: Timestamp;
  nextStepDate?: Timestamp;
}

export async function addApplication(uid: string, app: Application) {
  return addDoc(collection(getDb(), "applications"), { uid, ...app, createdAt: Timestamp.now() });
}

export async function listApplications(uid: string): Promise<(Application & { id: string })[]> {
  const q = query(collection(getDb(), "applications"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Application) }));
}

export interface UserDoc {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Timestamp;
}

export interface UserProfileDoc {
  uid: string;
  summary?: string;
  skills?: string[];
  location?: string;
  preferences?: Record<string, unknown>;
  updatedAt?: Timestamp;
}

export interface JobDoc {
  title: string;
  company: string;
  location?: string;
  remote?: boolean;
  salary?: string;
  link?: string;
  postedAt?: Timestamp;
  tags?: string[];
  source?: string;
}

export interface SavedJobDoc {
  uid: string;
  jobId: string;
  notes?: string;
  savedAt?: Timestamp;
}

export interface InterviewSessionDoc {
  uid: string;
  role?: string;
  question?: string;
  answer?: string;
  feedback?: string;
  createdAt?: Timestamp;
}

export interface CVDoc {
  uid: string;
  content: string;
  version?: string;
  updatedAt?: Timestamp;
}

export interface SkillGapAnalysisDoc {
  uid: string;
  targetRole?: string;
  gaps?: string[];
  plan?: string;
  createdAt?: Timestamp;
}

export async function upsertUser(uid: string, data: Omit<UserDoc, "uid">) {
  return setDoc(doc(getDb(), "users", uid), { uid, ...data, createdAt: Timestamp.now() }, { merge: true });
}

export async function getUser(uid: string) {
  const snap = await getDoc(doc(getDb(), "users", uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function upsertUserProfile(uid: string, profile: Omit<UserProfileDoc, "uid">) {
  return setDoc(doc(getDb(), "profiles", uid), { uid, ...profile, updatedAt: Timestamp.now() }, { merge: true });
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(getDb(), "profiles", uid));
  return snap.exists() ? (snap.data() as UserProfileDoc) : null;
}

export async function addJob(job: JobDoc) {
  return addDoc(collection(getDb(), "jobs"), { ...job, postedAt: job.postedAt ?? Timestamp.now() });
}

export async function getJob(id: string) {
  const snap = await getDoc(doc(getDb(), "jobs", id));
  return snap.exists() ? (snap.data() as JobDoc) : null;
}

export async function listJobsByTag(tag?: string) {
  if (!tag) {
    const snap = await getDocs(collection(getDb(), "jobs"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as JobDoc) }));
  }
  const q = query(collection(getDb(), "jobs"), where("tags", "array-contains", tag));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as JobDoc) }));
}

export async function saveJob(s: SavedJobDoc) {
  return addDoc(collection(getDb(), "saved_jobs"), { ...s, savedAt: s.savedAt ?? Timestamp.now() });
}

export async function listSavedJobs(uid: string) {
  const q = query(collection(getDb(), "saved_jobs"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as SavedJobDoc) }));
}

export async function addInterviewSession(s: InterviewSessionDoc) {
  return addDoc(collection(getDb(), "interview_sessions"), { ...s, createdAt: s.createdAt ?? Timestamp.now() });
}

export async function listInterviewSessions(uid: string) {
  const q = query(collection(getDb(), "interview_sessions"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as InterviewSessionDoc) }));
}

export async function upsertCV(uid: string, content: string, version?: string) {
  return setDoc(doc(getDb(), "cvs", uid), { uid, content, version, updatedAt: Timestamp.now() }, { merge: true });
}

export async function getCV(uid: string) {
  const snap = await getDoc(doc(getDb(), "cvs", uid));
  return snap.exists() ? (snap.data() as CVDoc) : null;
}

export async function addSkillGapAnalysis(a: SkillGapAnalysisDoc) {
  return addDoc(collection(getDb(), "skill_gap_analyses"), { ...a, createdAt: a.createdAt ?? Timestamp.now() });
}

export async function listSkillGapAnalyses(uid: string) {
  const q = query(collection(getDb(), "skill_gap_analyses"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as SkillGapAnalysisDoc) }));
}

export async function updateApplication(id: string, patch: Partial<Application>) {
  await updateDoc(doc(getDb(), "applications", id), patch);
}