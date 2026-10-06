export interface ApiResponse<T> {
  status: "ok" | "error";
  message?: string;
  data: T;
}

export interface CV {
  id: string;
  userId: string;
  fileName: string;
  fileUrl?: string | null;
  rawText?: string | null;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  candidateProfile?: CandidateProfile | null;
}

export interface CandidateProfile {
  id: string;
  cvId: string;
  fullName?: string | null;
  headline?: string | null;
  summary?: string | null;
  skills?: unknown;
  experience?: unknown;
  education?: unknown;
  certifications?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  requirements?: unknown;
  sourceUrl?: string | null;
  source?: string | null;
  postedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobMatch {
  id: string;
  userId: string;
  jobId: string;
  matchScore: number;
  explanation?: string | null;
  matchedSkills?: unknown;
  missingSkills?: unknown;
  createdAt: string;
  job?: Job;
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobTitle?: string | null;
  company?: string | null;
  sessionType?: string | null;
  overallScore?: number | null;
  createdAt: string;
  updatedAt: string;
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  question: string;
  category?: string | null;
  difficulty?: string | null;
  order: number;
  createdAt: string;
  answer?: InterviewAnswer | null;
}

export interface InterviewAnswer {
  id: string;
  questionId: string;
  answerText: string;
  score?: number | null;
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
}
