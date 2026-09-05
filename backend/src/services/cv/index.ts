/**
 * CV Service
 *
 * Handles CV creation, retrieval, and deletion with associated
 * CandidateProfile extraction.
 */

import { prisma } from "@/database/prisma.js";
import { ApiError } from "@/types/index.js";
import { AIService, CVAnalysisResult } from "@/services/ai/index.js";

export interface CreateCVData {
  userId: string;
  fileName: string;
  rawText: string;
  fileUrl?: string;
}

export class CVService {
  private aiService?: AIService;

  private getAIService(): AIService {
    if (!this.aiService) {
      this.aiService = new AIService();
    }

    return this.aiService;
  }

  async createCV(data: CreateCVData) {
    const cv = await prisma.cV.create({
      data: {
        userId: data.userId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        rawText: data.rawText,
      },
    });

    const profile = this.extractCandidateProfile(data.rawText);

    const candidateProfile = await prisma.candidateProfile.create({
      data: {
        cvId: cv.id,
        fullName: profile.fullName,
        headline: profile.headline,
        summary: profile.summary,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        certifications: profile.certifications,
      },
    });

    return {
      cv,
      candidateProfile,
    };
  }

  async listCVs(userId: string) {
    const cvs = await prisma.cV.findMany({
      where: { userId },
      include: { candidateProfile: true },
      orderBy: { createdAt: "desc" },
    });

    return cvs;
  }

  async getCV(cvId: string, userId: string) {
    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
      include: { candidateProfile: true },
    });

    if (!cv) {
      throw new ApiError(404, "CV not found");
    }

    if (cv.userId !== userId) {
      throw new ApiError(403, "Unauthorized access to this CV");
    }

    return cv;
  }

  async deleteCV(cvId: string, userId: string) {
    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
    });

    if (!cv) {
      throw new ApiError(404, "CV not found");
    }

    if (cv.userId !== userId) {
      throw new ApiError(403, "Unauthorized to delete this CV");
    }

    await prisma.cV.delete({
      where: { id: cvId },
    });

    return { success: true, message: "CV deleted successfully" };
  }

  private extractCandidateProfile(rawText: string) {
    const lines = rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const fullName = this.extractName(lines);
    const skills = this.extractSkills(rawText);

    return {
      fullName,
      headline: null,
      summary: null,
      skills,
      experience: [],
      education: [],
      certifications: [],
    };
  }

  private extractName(lines: string[]): string | null {
    if (lines.length === 0) {
      return null;
    }

    const firstLine = lines[0];

    const excludedHeadings = [
      "curriculum vitae",
      "resume",
      "cv",
      "profile",
      "summary",
      "experience",
      "education",
      "skills",
    ];

    if (
      excludedHeadings.some((heading) => firstLine.toLowerCase() === heading)
    ) {
      return null;
    }

    return firstLine;
  }

  private extractSkills(rawText: string): string[] {
    const knownSkills = [
      "Java",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Python",
      "C++",
      "C#",
      "SQL",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "Docker",
      "Git",
      "GitHub",
      "AWS",
      "HTML",
      "CSS",
      "Tailwind CSS",
    ];

    const normalizedText = rawText.toLowerCase();

    return knownSkills.filter((skill) =>
      normalizedText.includes(skill.toLowerCase()),
    );
  }

  async analyzeCV(
    cvId: string,
    userId: string,
  ): Promise<{
    cvId: string;
    fileName: string;
    analysis: CVAnalysisResult;
  }> {
    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
    });

    if (!cv) {
      throw new ApiError(404, "CV not found");
    }

    if (cv.userId !== userId) {
      throw new ApiError(403, "Unauthorized access to this CV");
    }

    if (!cv.rawText?.trim()) {
      throw new ApiError(400, "CV does not contain text for analysis");
    }

    const analysis = await this.getAIService().analyzeCV(cv.rawText);

    return {
      cvId: cv.id,
      fileName: cv.fileName,
      analysis,
    };
  }
}
