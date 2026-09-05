/**
 * AI Service
 *
 * Centralized AI integration for HireLens.
 *
 * The rest of the application should not communicate
 * directly with the Gemini SDK. This keeps the AI provider
 * replaceable in the future.
 */

import { GoogleGenAI } from "@google/genai";
import { ApiError } from "@/types/index.js";

export interface CVAnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: {
    technical: string[];
    soft: string[];
  };
  experienceAnalysis: string;
  educationAnalysis: string;
  atsCompatibility: number;
  recommendations: string[];
}

export interface JobMatchResult {
  matchScore: number;
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export class AIService {
  private readonly client: GoogleGenAI;
  private readonly model: string;
  private readonly fallbackModel: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.client = new GoogleGenAI({
      apiKey,
    });

    this.model = process.env.GEMINI_MODEL || "gemini-3.7-flash";
    this.fallbackModel =
      process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash";
  }

  async analyzeCV(rawText: string): Promise<CVAnalysisResult> {
    if (!rawText.trim()) {
      throw new ApiError(400, "CV text cannot be empty");
    }

    const prompt = this.buildCVAnalysisPrompt(rawText);

    try {
      return await this.generateAnalysis(this.model, prompt);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (this.isTemporaryAvailabilityError(error)) {
        console.warn(
          `Gemini model ${this.model} is temporarily unavailable. ` +
            `Trying fallback model ${this.fallbackModel}.`,
        );

        try {
          return await this.generateAnalysis(this.fallbackModel, prompt);
        } catch (fallbackError) {
          if (fallbackError instanceof ApiError) {
            throw fallbackError;
          }

          console.error("Gemini fallback CV analysis failed:", fallbackError);

          throw new ApiError(
            503,
            "AI service is temporarily unavailable. Please try again later.",
          );
        }
      }

      console.error("Gemini CV analysis failed:", error);

      throw new ApiError(502, "Unable to analyze CV with the AI service");
    }
  }

  async matchJob(
    candidateProfile: {
      fullName: string | null;
      headline: string | null;
      summary: string | null;
      skills: unknown;
      experience: unknown;
      education: unknown;
      certifications: unknown;
    },
    job: {
      title: string;
      company: string;
      location: string | null;
      description: string | null;
      requirements: unknown;
    },
  ): Promise<JobMatchResult> {
    const prompt = this.buildJobMatchPrompt(candidateProfile, job);

    try {
      return await this.generateJobMatch(this.model, prompt);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (this.isTemporaryAvailabilityError(error)) {
        console.warn(
          `Gemini model ${this.model} is temporarily unavailable. ` +
            `Trying fallback model ${this.fallbackModel}.`,
        );

        try {
          return await this.generateJobMatch(this.fallbackModel, prompt);
        } catch (fallbackError) {
          if (fallbackError instanceof ApiError) {
            throw fallbackError;
          }

          console.error("Gemini fallback job matching failed:", fallbackError);

          throw new ApiError(
            503,
            "AI service is temporarily unavailable. Please try again later.",
          );
        }
      }

      console.error("Gemini job matching failed:", error);

      throw new ApiError(502, "Unable to match job with the AI service");
    }
  }

  private async generateAnalysis(
    model: string,
    prompt: string,
  ): Promise<CVAnalysisResult> {
    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: {
              type: "number",
            },
            summary: {
              type: "string",
            },
            strengths: {
              type: "array",
              items: {
                type: "string",
              },
            },
            weaknesses: {
              type: "array",
              items: {
                type: "string",
              },
            },
            skills: {
              type: "object",
              properties: {
                technical: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                soft: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["technical", "soft"],
            },
            experienceAnalysis: {
              type: "string",
            },
            educationAnalysis: {
              type: "string",
            },
            atsCompatibility: {
              type: "number",
            },
            recommendations: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: [
            "score",
            "summary",
            "strengths",
            "weaknesses",
            "skills",
            "experienceAnalysis",
            "educationAnalysis",
            "atsCompatibility",
            "recommendations",
          ],
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new ApiError(502, "AI service returned an empty response");
    }

    return this.parseAnalysisResponse(text);
  }

  private isTemporaryAvailabilityError(error: unknown): boolean {
    if (!error || typeof error !== "object") {
      return false;
    }

    const candidate = error as {
      status?: number;
      code?: number;
      message?: string;
    };

    return (
      candidate.status === 503 ||
      candidate.code === 503 ||
      candidate.message?.includes("high demand") === true ||
      candidate.message?.includes("UNAVAILABLE") === true
    );
  }

  private buildCVAnalysisPrompt(rawText: string): string {
    return `
You are HireLens, a professional AI career intelligence system.

Analyze the following CV objectively and professionally.

Your analysis must evaluate:

1. Overall CV quality.
2. Strengths.
3. Weaknesses.
4. Technical skills.
5. Soft skills.
6. Experience quality and relevance.
7. Education.
8. ATS compatibility.
9. Specific actionable improvements.

Important rules:

- Do not invent information that is not present in the CV.
- Do not assume missing experience, qualifications, or skills.
- Base the analysis only on the supplied CV.
- Be constructive rather than unnecessarily negative.
- Keep recommendations practical and specific.
- score must be between 0 and 100.
- atsCompatibility must be between 0 and 100.
- Return only the requested JSON structure.

CV:

--- BEGIN CV ---
${rawText}
--- END CV ---
`;
  }

  private parseAnalysisResponse(text: string): CVAnalysisResult {
    try {
      const parsed = JSON.parse(text) as CVAnalysisResult;

      return {
        score: this.clampScore(parsed.score),
        summary: parsed.summary || "",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        skills: {
          technical: Array.isArray(parsed.skills?.technical)
            ? parsed.skills.technical
            : [],
          soft: Array.isArray(parsed.skills?.soft) ? parsed.skills.soft : [],
        },
        experienceAnalysis: parsed.experienceAnalysis || "",
        educationAnalysis: parsed.educationAnalysis || "",
        atsCompatibility: this.clampScore(parsed.atsCompatibility),
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [],
      };
    } catch {
      throw new ApiError(
        502,
        "AI service returned an invalid analysis response",
      );
    }
  }

  private async generateJobMatch(
    model: string,
    prompt: string,
  ): Promise<JobMatchResult> {
    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            matchScore: {
              type: "number",
            },
            explanation: {
              type: "string",
            },
            matchedSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            missingSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: [
            "matchScore",
            "explanation",
            "matchedSkills",
            "missingSkills",
          ],
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new ApiError(502, "AI service returned an empty response");
    }

    return this.parseJobMatchResponse(text);
  }

  private buildJobMatchPrompt(
    candidateProfile: {
      fullName: string | null;
      headline: string | null;
      summary: string | null;
      skills: unknown;
      experience: unknown;
      education: unknown;
      certifications: unknown;
    },
    job: {
      title: string;
      company: string;
      location: string | null;
      description: string | null;
      requirements: unknown;
    },
  ): string {
    return `
You are HireLens, a professional AI career intelligence system.

Evaluate how well the candidate matches the job opportunity.

Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Job:
${JSON.stringify(job, null, 2)}

Evaluate:

1. Overall suitability.
2. Skills that clearly match the job.
3. Important skills or qualifications missing from the candidate profile.
4. Experience relevance.
5. Overall match score.

Important rules:

- Base the evaluation only on the supplied candidate profile and job information.
- Do not invent candidate experience, qualifications, or skills.
- Do not assume that a missing skill is possessed by the candidate.
- Consider equivalent or closely related technologies where reasonable.
- The score must be between 0 and 100.
- matchedSkills must contain only skills supported by the candidate profile.
- missingSkills should contain important job requirements that are not demonstrated by the candidate.
- Keep the explanation professional, concise, and useful.
- Return only the requested JSON structure.

Return:
{
  "matchScore": number,
  "explanation": string,
  "matchedSkills": string[],
  "missingSkills": string[]
}
`;
  }

  private parseJobMatchResponse(text: string): JobMatchResult {
    try {
      const parsed = JSON.parse(text) as JobMatchResult;

      return {
        matchScore: this.clampScore(parsed.matchScore),
        explanation: parsed.explanation || "",
        matchedSkills: Array.isArray(parsed.matchedSkills)
          ? parsed.matchedSkills
          : [],
        missingSkills: Array.isArray(parsed.missingSkills)
          ? parsed.missingSkills
          : [],
      };
    } catch {
      throw new ApiError(
        502,
        "AI service returned an invalid job match response",
      );
    }
  }

  private clampScore(value: number): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return 0;
    }

    return Math.max(0, Math.min(100, Math.round(value)));
  }
}
