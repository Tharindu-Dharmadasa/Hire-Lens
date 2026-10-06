/**
 * Interview Service
 *
 * Handles AI-powered interview sessions and answers.
 */

import { prisma } from "@/database/prisma.js";
import { AIService } from "@/services/ai/index.js";
import { ApiError } from "@/types/index.js";

export interface CreateInterviewSessionData {
  userId: string;
  jobTitle?: string;
  company?: string;
  sessionType?: string;
  candidateProfile?: unknown;
  questionCount?: number;
}

export interface SubmitInterviewAnswerData {
  sessionId: string;
  questionId: string;
  userId: string;
  answerText: string;
}

export class InterviewService {
  private readonly aiService?: AIService;

  constructor(aiService?: AIService) {
    this.aiService = aiService;
  }

  async createSession(data: CreateInterviewSessionData) {
    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const aiService = this.aiService ?? new AIService();
    const generatedQuestions = await aiService.generateInterviewQuestions({
      jobTitle: data.jobTitle,
      company: data.company,
      sessionType: data.sessionType,
      candidateProfile: data.candidateProfile,
      questionCount: data.questionCount,
    });

    return prisma.$transaction(async (transaction) => {
      const session = await transaction.interviewSession.create({
        data: {
          userId: data.userId,
          jobTitle: data.jobTitle,
          company: data.company,
          sessionType: data.sessionType,
          questions: {
            create: generatedQuestions.map((generatedQuestion, index) => ({
              question: generatedQuestion.question,
              category: generatedQuestion.category,
              difficulty: generatedQuestion.difficulty,
              order: index + 1,
            })),
          },
        },
        include: {
          questions: true,
        },
      });

      return session;
    });
  }

  async listSessions(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return prisma.interviewSession.findMany({
      where: {
        userId,
      },
      include: {
        questions: {
          include: {
            answer: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSession(sessionId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        questions: {
          include: {
            answer: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!session) {
      throw new ApiError(404, "Interview session not found");
    }

    return session;
  }

  async submitAnswer(data: SubmitInterviewAnswerData) {
    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const session = await prisma.interviewSession.findFirst({
      where: {
        id: data.sessionId,
        userId: data.userId,
      },
    });

    if (!session) {
      throw new ApiError(404, "Interview session not found");
    }

    const question = await prisma.interviewQuestion.findFirst({
      where: {
        id: data.questionId,
        sessionId: data.sessionId,
      },
    });

    if (!question) {
      throw new ApiError(404, "Interview question not found");
    }

    if (!data.answerText.trim()) {
      throw new ApiError(400, "Answer text cannot be empty");
    }

    const aiService = this.aiService ?? new AIService();
    const evaluation = await aiService.evaluateInterviewAnswer({
      question: question.question,
      category: question.category,
      difficulty: question.difficulty,
      answer: data.answerText,
    });

    return prisma.$transaction(async (transaction) => {
      const answer = await transaction.interviewAnswer.upsert({
        where: {
          questionId: data.questionId,
        },
        update: {
          answerText: data.answerText,
          score: evaluation.score,
          feedback: evaluation.feedback,
        },
        create: {
          questionId: data.questionId,
          answerText: data.answerText,
          score: evaluation.score,
          feedback: evaluation.feedback,
        },
      });

      const answeredQuestions = await transaction.interviewQuestion.findMany({
        where: {
          sessionId: data.sessionId,
          answer: {
            is: {
              score: {
                not: null,
              },
            },
          },
        },
        select: {
          answer: {
            select: {
              score: true,
            },
          },
        },
      });

      const scores = answeredQuestions
        .map((answeredQuestion) => answeredQuestion.answer?.score)
        .filter(
          (score): score is number => score !== null && score !== undefined,
        );
      const overallScore = scores.length
        ? scores.reduce((total, score) => total + score, 0) / scores.length
        : null;

      await transaction.interviewSession.update({
        where: {
          id: data.sessionId,
        },
        data: {
          overallScore,
        },
      });

      return {
        answer,
        overallScore,
      };
    });
  }

  async deleteSession(sessionId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new ApiError(404, "Interview session not found");
    }

    await prisma.interviewSession.delete({
      where: {
        id: sessionId,
      },
    });

    return {
      success: true,
      message: "Interview session deleted successfully",
    };
  }
}
