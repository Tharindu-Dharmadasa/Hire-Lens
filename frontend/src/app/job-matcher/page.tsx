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
  List,
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
  IconBriefcase,
  IconSparkles,
} from "@tabler/icons-react";
import { apiRequest, getDemoUserId } from "@/lib/api";

type CandidateProfile = {
  fullName?: string | null;
  headline?: string | null;
  summary?: string | null;
  skills?: unknown;
  experience?: unknown;
  education?: unknown;
  certifications?: unknown;
};

interface ApiResponse<T> {
  status: "ok" | "error";
  message?: string;
  data: T;
}

interface JobRecord {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  requirements?: unknown;
  source?: string | null;
  sourceUrl?: string | null;
  createdAt?: string;
}

interface JobMatch {
  id: string;
  userId: string;
  jobId: string;
  matchScore: number;
  explanation?: string | null;
  matchedSkills?: unknown;
  missingSkills?: unknown;
  createdAt?: string;
}

interface MatchJobResponse {
  match: JobMatch;
  job: JobRecord;
  cv?: {
    id: string;
    fileName: string;
    uploadedAt?: string;
  };
  candidateProfile?: CandidateProfile | null;
}

// const sampleDescription = `We are looking for a Full-Stack Software Engineer Intern who can work with React, Next.js, Node.js, REST APIs, SQL databases, Git, and modern web development practices.

// Responsibilities:
// - Build responsive frontend interfaces
// - Develop backend API endpoints
// - Work with PostgreSQL or MySQL
// - Use Git for version control
// - Debug issues and improve code quality
// - Collaborate with the engineering team

// Preferred:
// - TypeScript
// - Prisma ORM
// - Docker
// - Basic cloud deployment knowledge`;

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [];
}

function toTextList(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string" ? item : JSON.stringify(item),
    );
  }

  if (typeof value === "string") {
    return [value];
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(
      ([key, item]) => {
        if (Array.isArray(item)) {
          return `${key}: ${item.join(", ")}`;
        }

        if (typeof item === "object" && item !== null) {
          return `${key}: ${JSON.stringify(item)}`;
        }

        return `${key}: ${String(item)}`;
      },
    );
  }

  return [String(value)];
}

export default function JobMatcherPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [job, setJob] = useState<JobRecord | null>(null);
  const [matchResult, setMatchResult] = useState<MatchJobResponse | null>(null);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [error, setError] = useState("");

  async function createJob() {
    setError("");
    setMatchResult(null);

    if (!title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!company.trim()) {
      setError("Company is required.");
      return;
    }

    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const parsedRequirements =
      skills.length > 0
        ? {
            skills,
          }
        : undefined;

    try {
      setLoadingCreate(true);

      const response = await apiRequest<ApiResponse<JobRecord>>("/jobs", {
        method: "POST",
        body: JSON.stringify({
          userId: getDemoUserId(),
          title,
          company,
          location,
          description,
          requirements: parsedRequirements,
          source: "HireLens Demo",
        }),
      });

      setJob(response.data);

      notifications.show({
        title: "Job created",
        message: "Job record was created successfully.",
        color: "green",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job.");
    } finally {
      setLoadingCreate(false);
    }
  }

  async function matchJob() {
    if (!job?.id) {
      setError("Create a job first before running the match.");
      return;
    }

    setError("");

    try {
      setLoadingMatch(true);

      const response = await apiRequest<ApiResponse<MatchJobResponse>>(
        `/jobs/${job.id}/match?userId=${encodeURIComponent(getDemoUserId())}`,
        {
          method: "POST",
          body: JSON.stringify({}),
        },
      );

      setMatchResult(response.data);

      notifications.show({
        title: "Job matched",
        message: "AI job matching completed successfully.",
        color: "blue",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to match job.");
    } finally {
      setLoadingMatch(false);
    }
  }

  const matchedSkills = normalizeList(matchResult?.match.matchedSkills);
  const missingSkills = normalizeList(matchResult?.match.missingSkills);

  const candidateProfile = matchResult?.candidateProfile;

  return (
    <main className="hero-shell">
      <Container size="lg">
        <Stack gap="xl">
          <div>
            <Badge
              size="lg"
              radius="xl"
              variant="light"
              leftSection={<IconBriefcase size={14} />}
            >
              Job Matcher
            </Badge>

            <Title order={1} mt="md" fz={{ base: 38, md: 56 }} fw={900}>
              Match your profile with{" "}
              <span className="gradient-title">real job requirements.</span>
            </Title>

            <Text c="dimmed" size="lg" mt="md" maw={780} lh={1.7}>
              Create a job record and compare it against your latest analyzed CV
              candidate profile. HireLens returns a match score, explanation,
              matched skills, and missing skills.
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
                    <Title order={3}>Job Input</Title>
                    <Badge variant="light">Step 1</Badge>
                  </Group>

                  <TextInput
                    label="Job title"
                    placeholder="Software Engineer Intern"
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                  />

                  <TextInput
                    label="Company"
                    placeholder="HireLens Inc."
                    value={company}
                    onChange={(event) => setCompany(event.currentTarget.value)}
                  />

                  <TextInput
                    label="Location"
                    placeholder="Colombo, Sri Lanka"
                    value={location}
                    onChange={(event) => setLocation(event.currentTarget.value)}
                  />

                  <Textarea
                    label="Job description"
                    placeholder="We are looking for a Full-Stack Software Engineer Intern who can work with React, Next.js, Node.js, REST APIs, SQL databases, Git, and modern web development practices."
                    description="Provide a brief description of the job role and responsibilities."
                    autosize
                    minRows={10}
                    maxRows={20}
                    value={description}
                    onChange={(event) =>
                      setDescription(event.currentTarget.value)
                    }
                  />

                  <Textarea
                    label="Required skills"
                    description="Separate skills with commas"
                    placeholder="React, Next.js, Node.js, TypeScript, SQL, Git"
                    minRows={4}
                    value={skillsText}
                    onChange={(event) =>
                      setSkillsText(event.currentTarget.value)
                    }
                  />

                  <Group gap="xs">
                    {skillsText
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill) => (
                        <Badge key={skill} variant="light">
                          {skill}
                        </Badge>
                      ))}
                  </Group>

                  <Button
                    onClick={createJob}
                    loading={loadingCreate}
                    leftSection={<IconSparkles size={18} />}
                  >
                    Create Job Record
                  </Button>

                  <Button
                    variant="default"
                    onClick={matchJob}
                    loading={loadingMatch}
                    disabled={!job?.id}
                  >
                    Run AI Job Match
                  </Button>

                  {job ? (
                    <Alert color="green" radius="md">
                      Job created successfully.
                    </Alert>
                  ) : null}
                </Stack>
              </Card>
            </GridCol>

            <GridCol span={{ base: 12, md: 7 }}>
              <Stack gap="lg">
                <Card radius="xl" p="xl" withBorder className="glass-panel">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Title order={3}>AI Job Match Result</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Uses the latest analyzed CV profile for this demo user.
                      </Text>
                    </div>

                    {matchResult ? (
                      <Badge size="lg" color="green" variant="light">
                        Complete
                      </Badge>
                    ) : (
                      <Badge size="lg" color="gray" variant="light">
                        Waiting
                      </Badge>
                    )}
                  </Group>

                  {!matchResult ? (
                    <Text c="dimmed" mt="xl">
                      Create a job and click Run AI Job Match to see the result.
                      Make sure you already analyzed a CV first.
                    </Text>
                  ) : (
                    <Stack mt="xl" gap="xl">
                      <Card radius="lg" withBorder>
                        <Text size="sm" fw={700} c="dimmed">
                          Match Score
                        </Text>

                        <Group justify="space-between" mt={8}>
                          <Text fz={42} fw={900}>
                            {matchResult.match.matchScore}%
                          </Text>
                          <Badge size="lg" variant="light">
                            {matchResult.job.title}
                          </Badge>
                        </Group>

                        <Progress
                          value={matchResult.match.matchScore}
                          color="blue"
                          mt="sm"
                        />
                      </Card>

                      <div>
                        <Title order={4}>Explanation</Title>
                        <Text c="dimmed" mt="xs" lh={1.7}>
                          {matchResult.match.explanation ||
                            "No explanation returned."}
                        </Text>
                      </div>

                      <Divider />

                      <Grid>
                        <GridCol span={{ base: 12, md: 6 }}>
                          <Title order={4}>Matched Skills</Title>

                          {matchedSkills.length > 0 ? (
                            <Group mt="sm" gap="xs">
                              {matchedSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  color="green"
                                  variant="light"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </Group>
                          ) : (
                            <Text c="dimmed" mt="sm">
                              No matched skills returned.
                            </Text>
                          )}
                        </GridCol>

                        <GridCol span={{ base: 12, md: 6 }}>
                          <Title order={4}>Missing Skills</Title>

                          {missingSkills.length > 0 ? (
                            <Group mt="sm" gap="xs">
                              {missingSkills.map((skill) => (
                                <Badge key={skill} color="red" variant="light">
                                  {skill}
                                </Badge>
                              ))}
                            </Group>
                          ) : (
                            <Text c="dimmed" mt="sm">
                              No missing skills returned.
                            </Text>
                          )}
                        </GridCol>
                      </Grid>

                      <Divider />

                      <div>
                        <Title order={4}>Job Details</Title>
                        <List mt="sm" spacing="xs">
                          <List.Item>
                            Company: {matchResult.job.company}
                          </List.Item>
                          <List.Item>
                            Location:{" "}
                            {matchResult.job.location || "Not specified"}
                          </List.Item>
                          <List.Item>
                            CV Used:{" "}
                            {matchResult.cv?.fileName || "Latest analyzed CV"}
                          </List.Item>
                        </List>
                      </div>
                    </Stack>
                  )}
                </Card>

                {matchResult?.candidateProfile ? (
                  <Card radius="xl" p="xl" withBorder className="glass-panel">
                    <Title order={3}>Candidate Profile Used</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                      This is the profile compared against the job.
                    </Text>

                    {candidateProfile && (
                      <Card withBorder radius="md" mt="md" p="md">
                        <Stack gap="sm">
                          <Title order={4}>Candidate Profile</Title>

                          {candidateProfile.fullName && (
                            <Text>
                              <strong>Name:</strong> {candidateProfile.fullName}
                            </Text>
                          )}

                          {candidateProfile.headline && (
                            <Text>
                              <strong>Headline:</strong>{" "}
                              {candidateProfile.headline}
                            </Text>
                          )}

                          {candidateProfile.summary && (
                            <Text>
                              <strong>Summary:</strong>{" "}
                              {candidateProfile.summary}
                            </Text>
                          )}

                          <Divider />

                          <Text fw={700}>Skills</Text>

                          <Group gap="xs">
                            {toTextList(candidateProfile.skills).map(
                              (skill) => (
                                <Badge key={skill} variant="light">
                                  {skill}
                                </Badge>
                              ),
                            )}
                          </Group>

                          <Text fw={700}>Experience</Text>

                          <Stack gap={4}>
                            {toTextList(candidateProfile.experience).map(
                              (item) => (
                                <Text key={item} size="sm">
                                  • {item}
                                </Text>
                              ),
                            )}
                          </Stack>

                          <Text fw={700}>Education</Text>

                          <Stack gap={4}>
                            {toTextList(candidateProfile.education).map(
                              (item) => (
                                <Text key={item} size="sm">
                                  • {item}
                                </Text>
                              ),
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    )}
                  </Card>
                ) : null}
              </Stack>
            </GridCol>
          </Grid>
        </Stack>
      </Container>
    </main>
  );
}
