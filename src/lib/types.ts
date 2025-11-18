import type { Timestamp } from "firebase/firestore";
import { z } from "zod";

export type UID = string;

export type User = {
  uid: UID;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Timestamp | number;
};

export type UserProfile = {
  uid: UID;
  summary?: string;
  skills?: string[];
  location?: string;
  preferences?: Record<string, unknown>;
  updatedAt?: Timestamp | number;
};

export type CVData = {
  uid: UID;
  content: string;
  version?: string;
  updatedAt?: Timestamp | number;
};

export type Job = {
  id?: string;
  title: string;
  company: string;
  location?: string;
  remote?: boolean;
  salary?: string;
  link?: string;
  postedAt?: Timestamp | number;
  tags?: string[];
  source?: string;
};

export type ApplicationStatus =
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "accepted"
  | "wishlist";

export type Application = {
  id?: string;
  uid: UID;
  title: string;
  company: string;
  url?: string;
  status?: ApplicationStatus;
  stage?: string;
  appliedAt?: Timestamp | number;
  nextStepDate?: Timestamp | number;
};

export type JobMatch = {
  title: string;
  company: string;
  matchReason?: string;
  link?: string;
};

export type JobMatchingRequest = {
  profile: { skills?: string; experience?: string } | Record<string, unknown>;
  preferences?: string | Record<string, unknown>;
};

export type JobMatchingResponse = { matches?: JobMatch[]; raw?: string; note?: string };

export type CVOptimizerRequest = { resume: string; targetRole: string };
export type CVOptimizerResponse = { suggestions: string | string[] };

export type InterviewPrepRequest = { role: string; transcript: string };
export type InterviewPrepResponse = { reply: string };

export type SkillGapRequest = { profile: string | Record<string, unknown>; targetRole: string };
export type SkillGapResponse = { plan?: string; gaps?: string[]; note?: string };

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});

export const userProfileSchema = z.object({
  uid: z.string(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});

export const cvDataSchema = z.object({
  uid: z.string(),
  content: z.string().min(1),
  version: z.string().optional(),
});

export const jobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  salary: z.string().optional(),
  link: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const applicationSchema = z.object({
  uid: z.string(),
  title: z.string().min(1),
  company: z.string().min(1),
  url: z.string().url().optional(),
  status: z.enum(["applied", "interview", "offer", "rejected", "accepted", "wishlist"]).optional(),
  stage: z.string().optional(),
});

export const jobMatchingRequestSchema = z.object({
  profile: z.union([
    z.object({ skills: z.string().optional(), experience: z.string().optional() }),
    z.record(z.string(), z.any()),
  ]),
  preferences: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
});

export const cvOptimizerRequestSchema = z.object({ resume: z.string().min(1), targetRole: z.string().min(1) });
export const interviewPrepRequestSchema = z.object({ role: z.string().min(1), transcript: z.string().min(1) });
export const skillGapRequestSchema = z.object({ profile: z.union([z.string(), z.record(z.string(), z.any())]), targetRole: z.string().min(1) });