"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Progress,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconMessageQuestion,
  IconSparkles,
} from "@tabler/icons-react";
import { apiRequest, getDemoUserId } from "@/lib/api";

interface ApiResponse<T> {
  status: "ok" | "error";
  message?: string;
  data: T;
}

interface InterviewAnswer {
  id: string;
  questionId: string;
  answerText: string;
  score?: number | null;
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InterviewQuestion {
  id: string;
  sessionId: string;
  question: string;
  category?: string | null;
  difficulty?: string | null;
  order: number;
  createdAt: string;
  answer?: InterviewAnswer | null;
}

interface InterviewSession {
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

interface SubmitAnswerResponse {
  answer: InterviewAnswer;
  overallScore: number | null;
}

function extractSessionFromResponse(data: unknown): InterviewSession {
  const response = data as {
    data?: InterviewSession | { session?: InterviewSession };
  };

  if (response.data && "id" in response.data) {
    return response.data;
  }

  if (
    response.data &&
    "session" in response.data &&
    response.data.session &&
    "id" in response.data.session
  ) {
    return response.data.session;
  }

  throw new Error(
    "Interview session was created but the response did not include a valid session id.",
  );
}

export default function InterviewCoachPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [questionCount, setQuestionCount] = useState("");

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<InterviewQuestion | null>(null);
  const [answerText, setAnswerText] = useState(
    "In my recent full-stack projects, I worked with Next.js, React, Node.js, Prisma, PostgreSQL, and REST APIs. I usually start by understanding requirements, designing the database, building backend endpoints, testing them with Postman, and then connecting the frontend. One example is HireLens, where I built CV analysis, job matching, and interview coaching features using a modular backend architecture.",
  );

  const [lastAnswer, setLastAnswer] = useState<InterviewAnswer | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [error, setError] = useState("");

  async function createInterviewSession() {
    setError("");
    setSession(null);
    setSelectedQuestion(null);
    setLastAnswer(null);
    setOverallScore(null);

    const parsedCount = Number(questionCount);

    if (!jobTitle.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!Number.isFinite(parsedCount) || parsedCount < 1 || parsedCount > 10) {
      setError("Question count must be a number between 1 and 10.");
      return;
    }

    try {
      setLoadingCreate(true);

      const response = await apiRequest<unknown>("/interviews", {
        method: "POST",
        body: JSON.stringify({
          userId: getDemoUserId(),
          jobTitle,
          company,
          sessionType,
          questionCount: parsedCount,
        }),
      });

      const createdSession = extractSessionFromResponse(response);

      setSession(createdSession);
      setSelectedQuestion(createdSession.questions?.[0] ?? null);
      setOverallScore(createdSession.overallScore ?? null);

      notifications.show({
        title: "Interview session created",
        message: "AI interview questions generated successfully.",
        color: "green",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create interview session.",
      );
    } finally {
      setLoadingCreate(false);
    }
  }

  async function submitAnswer() {
    if (!session?.id || !selectedQuestion?.id) {
      setError("Create an interview session and select a question first.");
      return;
    }

    if (!answerText.trim()) {
      setError("Answer text is required.");
      return;
    }

    setError("");

    try {
      setLoadingAnswer(true);

      const response = await apiRequest<ApiResponse<SubmitAnswerResponse>>(
        `/interviews/${session.id}/questions/${selectedQuestion.id}/answer?userId=${encodeURIComponent(
          getDemoUserId(),
        )}`,
        {
          method: "POST",
          body: JSON.stringify({
            answerText,
          }),
        },
      );

      setLastAnswer(response.data.answer);
      setOverallScore(response.data.overallScore);

      setSession((current) => {
        if (!current) return current;

        return {
          ...current,
          overallScore: response.data.overallScore,
          questions: current.questions.map((question) =>
            question.id === selectedQuestion.id
              ? { ...question, answer: response.data.answer }
              : question,
          ),
        };
      });

      notifications.show({
        title: "Answer evaluated",
        message: "AI feedback generated successfully.",
        color: "blue",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit interview answer.",
      );
    } finally {
      setLoadingAnswer(false);
    }
  }

  return (
    <main className="hero-shell">
      <Container size="lg">
        <Stack gap="xl">
          <div>
            <Badge
              size="lg"
              radius="xl"
              variant="light"
              leftSection={<IconMessageQuestion size={14} />}
            >
              Interview Coach
            </Badge>

            <Title order={1} mt="md" fz={{ base: 38, md: 56 }} fw={900}>
              Practise interviews with{" "}
              <span className="gradient-title">AI-powered feedback.</span>
            </Title>

            <Text c="dimmed" size="lg" mt="md" maw={780} lh={1.7}>
              Generate contextual interview questions, submit answers, and
              receive score-based feedback to improve your interview readiness.
            </Text>
          </div>

          {error ? (
            <Alert color="red" icon={<IconAlertCircle size={18} />} radius="md">
              {error}
            </Alert>
          ) : null}

          <Grid gutter="xl">
            <GridCol span={{ base: 12, md: 5 }}>
              <Card radius="xl" p="xl" withBorder className="glass-panel">
                <Stack>
                  <Group justify="space-between">
                    <Title order={3}>Create Session</Title>
                    <Badge variant="light">Step 1</Badge>
                  </Group>

                  <TextInput
                    label="Job title"
                    placeholder="Software Engineer Intern"
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.currentTarget.value)}
                  />

                  <TextInput
                    label="Company"
                    placeholder="HireLens Inc."
                    value={company}
                    onChange={(event) => setCompany(event.currentTarget.value)}
                  />

                  <TextInput
                    label="Session type"
                    placeholder="technical, behavioral, general, situational, etc."
                    description="technical, behavioral, general, situational, etc."
                    value={sessionType}
                    onChange={(event) =>
                      setSessionType(event.currentTarget.value)
                    }
                  />

                  <TextInput
                    label="Question count"
                    placeholder="5"
                    description="Use 1–10 questions"
                    value={questionCount}
                    onChange={(event) =>
                      setQuestionCount(event.currentTarget.value)
                    }
                  />

                  <Button
                    onClick={createInterviewSession}
                    loading={loadingCreate}
                    leftSection={<IconSparkles size={18} />}
                  >
                    Generate Interview Questions
                  </Button>

                  {session ? (
                    <Alert color="green" radius="md">
                      Interview session created. Session ID: {session.id}
                    </Alert>
                  ) : null}
                </Stack>
              </Card>

              {session ? (
                <Card
                  radius="xl"
                  p="xl"
                  withBorder
                  className="glass-panel"
                  mt="lg"
                >
                  <Stack>
                    <Group justify="space-between">
                      <Title order={3}>Questions</Title>
                      <Badge variant="light">
                        {session.questions.length} generated
                      </Badge>
                    </Group>

                    {session.questions.map((question) => (
                      <Card
                        key={question.id}
                        radius="lg"
                        withBorder
                        onClick={() => {
                          setSelectedQuestion(question);
                          setLastAnswer(question.answer ?? null);
                          setAnswerText(question.answer?.answerText ?? "");
                        }}
                        style={{
                          cursor: "pointer",
                          borderColor:
                            selectedQuestion?.id === question.id
                              ? "#228be6"
                              : undefined,
                        }}
                      >
                        <Group justify="space-between" mb="xs">
                          <Badge variant="light">Q{question.order}</Badge>
                          <Group gap="xs">
                            <Badge color="violet" variant="light">
                              {question.category || "general"}
                            </Badge>
                            <Badge color="gray" variant="light">
                              {question.difficulty || "medium"}
                            </Badge>
                          </Group>
                        </Group>

                        <Text fw={700} lh={1.5}>
                          {question.question}
                        </Text>

                        {question.answer ? (
                          <Badge mt="sm" color="green" variant="light">
                            Answered
                          </Badge>
                        ) : null}
                      </Card>
                    ))}
                  </Stack>
                </Card>
              ) : null}
            </GridCol>

            <GridCol span={{ base: 12, md: 7 }}>
              <Stack gap="lg">
                <Card radius="xl" p="xl" withBorder className="glass-panel">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Title order={3}>Answer Evaluation</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Select a question, write your answer, and get AI scoring
                        with feedback.
                      </Text>
                    </div>

                    {lastAnswer ? (
                      <Badge size="lg" color="green" variant="light">
                        Evaluated
                      </Badge>
                    ) : (
                      <Badge size="lg" color="gray" variant="light">
                        Waiting
                      </Badge>
                    )}
                  </Group>

                  {!selectedQuestion ? (
                    <Text c="dimmed" mt="xl">
                      Generate an interview session and select a question to
                      start answering.
                    </Text>
                  ) : (
                    <Stack mt="xl">
                      <Card radius="lg" withBorder>
                        <Group justify="space-between" mb="sm">
                          <Badge variant="light">
                            Question {selectedQuestion.order}
                          </Badge>
                          <Group gap="xs">
                            <Badge color="violet" variant="light">
                              {selectedQuestion.category || "general"}
                            </Badge>
                            <Badge color="gray" variant="light">
                              {selectedQuestion.difficulty || "medium"}
                            </Badge>
                          </Group>
                        </Group>

                        <Text fw={800} lh={1.6}>
                          {selectedQuestion.question}
                        </Text>
                      </Card>

                      <Textarea
                        label="Your answer"
                        placeholder="Write your interview answer here..."
                        minRows={9}
                        value={answerText}
                        onChange={(event) =>
                          setAnswerText(event.currentTarget.value)
                        }
                      />

                      <Button
                        onClick={submitAnswer}
                        loading={loadingAnswer}
                        disabled={!selectedQuestion}
                      >
                        Submit Answer for AI Feedback
                      </Button>

                      {lastAnswer ? (
                        <>
                          <Divider />

                          <Grid>
                            <GridCol span={{ base: 12, sm: 6 }}>
                              <Card radius="lg" withBorder>
                                <Text size="sm" fw={700} c="dimmed">
                                  Answer Score
                                </Text>
                                <Text fz={42} fw={900} mt={8}>
                                  {lastAnswer.score ?? 0}%
                                </Text>
                                <Progress
                                  value={lastAnswer.score ?? 0}
                                  mt="sm"
                                />
                              </Card>
                            </GridCol>

                            <GridCol span={{ base: 12, sm: 6 }}>
                              <Card radius="lg" withBorder>
                                <Text size="sm" fw={700} c="dimmed">
                                  Overall Score
                                </Text>
                                <Text fz={42} fw={900} mt={8}>
                                  {overallScore ?? 0}%
                                </Text>
                                <Progress
                                  value={overallScore ?? 0}
                                  color="violet"
                                  mt="sm"
                                />
                              </Card>
                            </GridCol>
                          </Grid>

                          <div>
                            <Title order={4}>AI Feedback</Title>
                            <Text c="dimmed" mt="xs" lh={1.7}>
                              {lastAnswer.feedback || "No feedback returned."}
                            </Text>
                          </div>
                        </>
                      ) : null}
                    </Stack>
                  )}
                </Card>
              </Stack>
            </GridCol>
          </Grid>
        </Stack>
      </Container>
    </main>
  );
}
