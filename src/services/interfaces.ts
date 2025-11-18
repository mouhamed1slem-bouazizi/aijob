import type {
  JobMatchingRequest,
  JobMatchingResponse,
  CVOptimizerRequest,
  CVOptimizerResponse,
  InterviewPrepRequest,
  InterviewPrepResponse,
  SkillGapRequest,
  SkillGapResponse,
  User,
  UserProfile,
  CVData,
  Job,
  Application,
} from "@/lib/types";

export interface AIService {
  matchJobs(input: JobMatchingRequest): Promise<JobMatchingResponse>;
  optimizeCV(input: CVOptimizerRequest): Promise<CVOptimizerResponse>;
  interviewPrep(input: InterviewPrepRequest): Promise<InterviewPrepResponse>;
  analyzeSkillGaps(input: SkillGapRequest): Promise<SkillGapResponse>;
}

export interface JobService {
  add(job: Job): Promise<string | void>;
  get(id: string): Promise<Job | null>;
  listByTag(tag?: string): Promise<(Job & { id: string })[]>;
  save(uid: string, jobId: string, notes?: string): Promise<void>;
  listSaved(uid: string): Promise<({ id: string } & { uid: string; jobId: string; notes?: string })[]>;
}

export interface CVService {
  parsePDF(buffer: ArrayBuffer): Promise<CVData>;
  upsert(uid: string, data: CVData): Promise<void>;
  get(uid: string): Promise<CVData | null>;
}

export interface InterviewService {
  add(session: { uid: string; role?: string; question?: string; answer?: string }): Promise<string | void>;
  list(uid: string): Promise<({ id: string } & { uid: string; role?: string; question?: string; answer?: string; feedback?: string })[]>;
}

export interface UserService {
  upsert(user: User): Promise<void>;
  get(uid: string): Promise<User | null>;
  upsertProfile(uid: string, profile: UserProfile): Promise<void>;
  getProfile(uid: string): Promise<UserProfile | null>;
  addApplication(uid: string, app: Application): Promise<string | void>;
  listApplications(uid: string): Promise<(Application & { id: string })[]>;
}