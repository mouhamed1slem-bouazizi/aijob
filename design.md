# Design Document: AI-Powered Job Search & Career Assistant Platform

## Overview

This document outlines the technical design for an AI-powered career platform built on Next.js 16 with TypeScript, React 19, and Tailwind CSS. The platform integrates with the ChatAnywhere API for AI capabilities and multiple job aggregation APIs to provide comprehensive career assistance including job matching, CV optimization, interview training, and application tracking.

### Technology Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **AI Provider**: ChatAnywhere API (https://api.chatanywhere.tech)
- **Job APIs**: SerpAPI (Google Jobs), Jooble API, Indeed API, LinkedIn
- **Database**: PostgreSQL (via Vercel Postgres or similar)
- **Authentication**: NextAuth.js v5
- **File Storage**: Vercel Blob or AWS S3
- **PDF Processing**: pdf-parse or pdf.js
- **State Management**: React Context + Server Components
- **API Layer**: Next.js API Routes (App Router)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Job Search  │  │  Interview   │      │
│  │  Components  │  │  Components  │  │  Trainer     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│              Next.js App Router (Server Layer)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Components (RSC) + API Routes                │   │
│  │  - Page rendering                                     │   │
│  │  - Data fetching                                      │   │
│  │  - Server actions                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   AI     │  │   Job    │  │   CV     │  │  User    │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  External Services Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ChatAnywhere│ │ SerpAPI │  │ Jooble  │  │ Database │   │
│  │    API   │  │   API    │  │   API   │  │PostgreSQL│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── cv-builder/
│   │   │   ├── interview-trainer/
│   │   │   ├── skill-gap/
│   │   │   ├── applications/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   ├── jobs/
│   │   │   ├── cv/
│   │   │   ├── interview/
│   │   │   ├── user/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── cv/
│   │   └── interview/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── ai-service.ts
│   │   │   ├── job-service.ts
│   │   │   ├── cv-service.ts
│   │   │   ├── interview-service.ts
│   │   │   └── user-service.ts
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   ├── queries.ts
│   │   │   └── client.ts
│   │   ├── utils/
│   │   │   ├── pdf-parser.ts
│   │   │   ├── linkedin-parser.ts
│   │   │   ├── job-matcher.ts
│   │   │   └── validators.ts
│   │   └── config.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── job.ts
│   │   ├── cv.ts
│   │   └── interview.ts
│   └── hooks/
│       ├── use-user.ts
│       ├── use-jobs.ts
│       └── use-cv.ts
├── public/
├── prisma/ (or drizzle/)
│   └── schema.prisma
└── package.json
```

## Components and Interfaces

### 1. AI Service Layer

**Purpose**: Centralized service for all AI interactions with ChatAnywhere API

```typescript
interface AIServiceConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  context?: Record<string, any>;
  maxTokens?: number;
}

interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

class AIService {
  async chat(request: AIRequest): Promise<AIResponse>
  async streamChat(request: AIRequest): AsyncGenerator<string>
  async extractCVData(cvText: string): Promise<CVData>
  async matchJob(cv: CVData, job: JobDescription): Promise<MatchResult>
  async generateCoverLetter(cv: CVData, job: JobDescription, tone: string): Promise<string>
  async evaluateCV(cv: CVData): Promise<CVEvaluation>
  async generateInterviewQuestions(context: InterviewContext): Promise<Question[]>
  async evaluateInterviewAnswer(question: string, answer: string): Promise<AnswerEvaluation>
  async analyzeSkillGap(userSkills: string[], jobSkills: string[]): Promise<SkillGapAnalysis>
}
```

### 2. Job Service Layer

**Purpose**: Aggregate and manage job listings from multiple sources

```typescript
interface JobSource {
  name: string;
  fetchJobs(query: JobQuery): Promise<Job[]>;
  parseJobUrl(url: string): Promise<Job>;
}

interface JobQuery {
  keywords?: string;
  location?: string;
  remote?: boolean;
  experienceLevel?: string;
  salary?: { min?: number; max?: number };
  limit?: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary?: { min?: number; max?: number; currency: string };
  remote: boolean;
  url: string;
  source: string;
  postedDate: Date;
  matchScore?: number;
}

class JobService {
  async searchJobs(query: JobQuery, userId: string): Promise<Job[]>
  async getJobById(jobId: string): Promise<Job>
  async parseJobUrl(url: string): Promise<Job>
  async calculateMatchScore(job: Job, userProfile: UserProfile): Promise<number>
  async saveJob(userId: string, jobId: string): Promise<void>
  async getSavedJobs(userId: string): Promise<Job[]>
}
```

### 3. CV Service Layer

**Purpose**: Handle CV parsing, generation, and optimization

```typescript
interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
}

interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
}

interface CVEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  atsCompatibility: number;
  suggestions: string[];
  keywordDensity: Record<string, number>;
}

class CVService {
  async parsePDF(file: Buffer): Promise<CVData>
  async parseLinkedIn(profileUrl: string): Promise<CVData>
  async evaluateCV(cv: CVData): Promise<CVEvaluation>
  async optimizeCV(cv: CVData, targetJob?: Job): Promise<CVData>
  async generateCoverLetter(cv: CVData, job: Job, tone: string): Promise<string>
  async saveCV(userId: string, cv: CVData): Promise<string>
  async getUserCVs(userId: string): Promise<CVData[]>
}
```

### 4. Interview Service Layer

**Purpose**: Manage interview training and evaluation

```typescript
interface InterviewContext {
  cv: CVData;
  targetJob?: Job;
  industry?: string;
  experienceLevel?: string;
}

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  expectedKeywords: string[];
}

interface AnswerEvaluation {
  score: number;
  clarity: number;
  confidence: number;
  keywordUsage: number;
  starMethodUsage: boolean;
  feedback: string;
  improvements: string[];
}

interface InterviewSession {
  id: string;
  userId: string;
  questions: Question[];
  answers: { questionId: string; answer: string; evaluation: AnswerEvaluation }[];
  overallScore: number;
  startedAt: Date;
  completedAt?: Date;
}

class InterviewService {
  async generateQuestions(context: InterviewContext, count: number): Promise<Question[]>
  async startSession(userId: string, context: InterviewContext): Promise<InterviewSession>
  async submitAnswer(sessionId: string, questionId: string, answer: string): Promise<AnswerEvaluation>
  async completeSession(sessionId: string): Promise<InterviewSession>
  async getUserSessions(userId: string): Promise<InterviewSession[]>
}
```

### 5. User Service Layer

**Purpose**: Manage user accounts, profiles, and application tracking

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  cv?: CVData;
  preferences: {
    jobTypes: string[];
    locations: string[];
    remote: boolean;
    salaryMin?: number;
  };
  scores: {
    cvScore: number;
    interviewScore: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Application {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
  appliedDate: Date;
  notes?: string;
  nextAction?: string;
  nextActionDate?: Date;
}

class UserService {
  async createUser(email: string, password: string, name: string): Promise<UserProfile>
  async getUserProfile(userId: string): Promise<UserProfile>
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>
  async trackApplication(userId: string, jobId: string): Promise<Application>
  async updateApplicationStatus(applicationId: string, status: Application['status']): Promise<Application>
  async getApplications(userId: string): Promise<Application[]>
  async generateFollowUpMessage(application: Application): Promise<string>
}
```

## Data Models

### Database Schema

```typescript
// User Table
interface User {
  id: string; // UUID
  email: string; // unique
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// UserProfile Table
interface UserProfileDB {
  id: string;
  userId: string; // FK to User
  cvData: JSON; // CVData
  preferences: JSON;
  cvScore: number;
  interviewScore: number;
  updatedAt: Date;
}

// Job Table (cached jobs)
interface JobDB {
  id: string;
  externalId: string;
  source: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: JSON;
  skills: string[];
  salary: JSON;
  remote: boolean;
  url: string;
  postedDate: Date;
  fetchedAt: Date;
}

// SavedJob Table
interface SavedJobDB {
  id: string;
  userId: string; // FK to User
  jobId: string; // FK to Job
  matchScore: number;
  savedAt: Date;
}

// Application Table
interface ApplicationDB {
  id: string;
  userId: string; // FK to User
  jobId: string; // FK to Job
  status: string;
  appliedDate: Date;
  notes: string;
  nextAction: string;
  nextActionDate: Date;
  updatedAt: Date;
}

// InterviewSession Table
interface InterviewSessionDB {
  id: string;
  userId: string; // FK to User
  context: JSON;
  questions: JSON;
  answers: JSON;
  overallScore: number;
  startedAt: Date;
  completedAt: Date;
}

// CV Table (multiple versions)
interface CVDB {
  id: string;
  userId: string; // FK to User
  name: string;
  data: JSON; // CVData
  score: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// SkillGapAnalysis Table
interface SkillGapAnalysisDB {
  id: string;
  userId: string; // FK to User
  jobId: string; // FK to Job
  missingSkills: string[];
  recommendations: JSON;
  estimatedTime: number;
  createdAt: Date;
}
```

## Error Handling

### Error Types

```typescript
class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

// Specific error classes
class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(401, 'AUTH_ERROR', message);
  }
}

class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(429, 'RATE_LIMIT_ERROR', message);
  }
}

class ExternalServiceError extends APIError {
  constructor(service: string, message: string) {
    super(503, 'EXTERNAL_SERVICE_ERROR', `${service}: ${message}`);
  }
}
```

### Error Handling Strategy

1. **API Route Level**: Wrap all API routes with error boundary middleware
2. **Service Level**: Implement retry logic with exponential backoff for external APIs
3. **Client Level**: Display user-friendly error messages with recovery options
4. **Logging**: Log all errors to monitoring service (e.g., Sentry, LogRocket)

```typescript
// API Route Error Handler
export async function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: error.statusCode }
    );
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error);
  
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}

// Service Level Retry Logic
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Testing Strategy

### Unit Testing

- **Framework**: Jest + React Testing Library
- **Coverage Target**: 80% for services, 70% for components
- **Focus Areas**:
  - Service layer business logic
  - Utility functions (PDF parsing, job matching algorithms)
  - Data validation and transformation
  - Error handling

```typescript
// Example: CV Service Test
describe('CVService', () => {
  describe('parsePDF', () => {
    it('should extract personal info from CV PDF', async () => {
      const mockPDF = await readFile('test-cv.pdf');
      const result = await cvService.parsePDF(mockPDF);
      
      expect(result.personalInfo.name).toBe('John Doe');
      expect(result.personalInfo.email).toBe('john@example.com');
      expect(result.skills).toContain('JavaScript');
    });
    
    it('should handle malformed PDF gracefully', async () => {
      const invalidPDF = Buffer.from('invalid');
      
      await expect(cvService.parsePDF(invalidPDF))
        .rejects.toThrow(ValidationError);
    });
  });
});
```

### Integration Testing

- **Framework**: Jest + Supertest for API routes
- **Focus Areas**:
  - API endpoint functionality
  - Database operations
  - External API integrations (with mocks)
  - Authentication flows

```typescript
// Example: Job API Integration Test
describe('POST /api/jobs/search', () => {
  it('should return matched jobs for authenticated user', async () => {
    const response = await request(app)
      .post('/api/jobs/search')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ keywords: 'software engineer', location: 'remote' });
    
    expect(response.status).toBe(200);
    expect(response.body.jobs).toBeInstanceOf(Array);
    expect(response.body.jobs[0]).toHaveProperty('matchScore');
  });
});
```

### End-to-End Testing

- **Framework**: Playwright
- **Focus Areas**:
  - Critical user journeys
  - CV upload and analysis flow
  - Job search and application tracking
  - Interview training session

```typescript
// Example: E2E Test
test('complete job application flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await page.goto('/jobs');
  await page.fill('[name="search"]', 'software engineer');
  await page.click('button:has-text("Search")');
  
  await page.click('.job-card:first-child');
  await expect(page.locator('.match-score')).toBeVisible();
  
  await page.click('button:has-text("Save Job")');
  await expect(page.locator('text=Job saved')).toBeVisible();
});
```

### Performance Testing

- **Tools**: Lighthouse, WebPageTest
- **Metrics**:
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3.5s
  - Largest Contentful Paint < 2.5s
- **Load Testing**: k6 for API endpoints under load

## Security Considerations

### Authentication & Authorization

- Use NextAuth.js v5 with JWT tokens
- Implement role-based access control (RBAC)
- Secure session management with httpOnly cookies
- Password hashing with bcrypt (cost factor: 12)

### Data Protection

- Encrypt sensitive data at rest (CV data, personal info)
- Use HTTPS for all communications
- Implement CORS policies
- Sanitize all user inputs
- Validate file uploads (type, size, content)

### API Security

- Rate limiting per user/IP
- API key rotation for external services
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)

### Privacy Compliance

- GDPR compliance for EU users
- Data retention policies
- User data export functionality
- Right to deletion implementation
- Privacy policy and terms of service

## Performance Optimization

### Frontend Optimization

- Server-side rendering for initial page loads
- Code splitting and lazy loading
- Image optimization with Next.js Image component
- Caching strategies (SWR for data fetching)
- Debouncing for search inputs

### Backend Optimization

- Database query optimization with indexes
- Caching layer (Redis) for:
  - Job listings (TTL: 1 hour)
  - User profiles (TTL: 15 minutes)
  - AI responses for common queries (TTL: 24 hours)
- Connection pooling for database
- Batch processing for bulk operations
- Background jobs for heavy operations (job scraping, CV analysis)

### API Rate Limiting

```typescript
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimits = {
  '/api/ai/*': { windowMs: 60000, maxRequests: 20 }, // 20 per minute
  '/api/jobs/search': { windowMs: 60000, maxRequests: 30 },
  '/api/cv/upload': { windowMs: 3600000, maxRequests: 10 }, // 10 per hour
};
```

## Deployment Strategy

### Environment Configuration

```typescript
// Development
const devConfig = {
  aiService: { baseUrl: 'https://api.chatanywhere.tech', model: 'gpt-3.5-turbo' },
  database: { url: process.env.DEV_DATABASE_URL },
  redis: { url: process.env.DEV_REDIS_URL },
};

// Production
const prodConfig = {
  aiService: { baseUrl: 'https://api.chatanywhere.tech', model: 'gpt-4' },
  database: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL },
};
```

### CI/CD Pipeline

1. **Build**: `npm run build`
2. **Test**: `npm run test` (unit + integration)
3. **Lint**: `npm run lint`
4. **E2E**: `npm run test:e2e` (staging only)
5. **Deploy**: Vercel deployment with preview environments

### Monitoring & Observability

- Application monitoring: Vercel Analytics
- Error tracking: Sentry
- Performance monitoring: Web Vitals
- API monitoring: Custom dashboard for API usage and costs
- Database monitoring: Query performance tracking

## Migration & Rollout Plan

### Phase 1: Core Infrastructure (Week 1-2)
- Set up Next.js project structure
- Configure database and authentication
- Implement AI service integration
- Create basic UI components

### Phase 2: CV & Job Features (Week 3-4)
- CV upload and parsing
- Job aggregation from APIs
- Job matching algorithm
- Basic dashboard

### Phase 3: AI Features (Week 5-6)
- CV optimization and scoring
- Cover letter generation
- Interview question generation
- Skill gap analysis

### Phase 4: Advanced Features (Week 7-8)
- Interview trainer with evaluation
- Application tracking
- Notifications and reminders
- Analytics dashboard

### Phase 5: Polish & Launch (Week 9-10)
- Performance optimization
- Security audit
- User testing and feedback
- Production deployment
