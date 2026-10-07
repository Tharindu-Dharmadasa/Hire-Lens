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
  JsonInput,
  List,
  Progress,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  FileInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconFileAnalytics,
  IconSparkles,
} from "@tabler/icons-react";
import { apiRequest, getDemoUserId } from "@/lib/api";

interface ApiResponse<T> {
  status: "ok" | "error";
  message?: string;
  data: T;
}

interface CVRecord {
  id: string;
  userId: string;
  fileName: string;
  rawText?: string | null;
}

interface CVAnalysis {
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

interface AnalyzeCVResponse {
  analysis: CVAnalysis;
  candidateProfile: unknown;
}

function extractCVFromResponse(data: unknown): CVRecord {
  const response = data as {
    data?: CVRecord | { cv?: CVRecord };
  };

  if (response.data && "id" in response.data) {
    return response.data;
  }

  if (
    response.data &&
    "cv" in response.data &&
    response.data.cv &&
    "id" in response.data.cv
  ) {
    return response.data.cv;
  }

  throw new Error(
    "CV was created but the response did not include a valid CV id.",
  );
}

export default function CVAnalyzerPage() {
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [cv, setCv] = useState<CVRecord | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<unknown>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  async function createCV() {
    setError("");
    setAnalysis(null);
    setCandidateProfile(null);

    if (!fileName.trim()) {
      setError("File name is required.");
      return;
    }

    if (!rawText.trim()) {
      setError("CV text is required.");
      return;
    }

    try {
      setLoadingCreate(true);

      const response = await apiRequest<unknown>("/cvs", {
        method: "POST",
        body: JSON.stringify({
          userId: getDemoUserId(),
          fileName,
          rawText,
        }),
      });

      const createdCV = extractCVFromResponse(response);

      setCv(createdCV);

      notifications.show({
        title: "CV created",
        message: "Your CV record was created successfully.",
        color: "green",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create CV.");
    } finally {
      setLoadingCreate(false);
    }
  }

  // Function to handle file upload and text extraction

  async function uploadCVFile() {
    setError("");
    setAnalysis(null);
    setCandidateProfile(null);

    if (!selectedFile) {
      setError("Please select a PDF or DOCX file.");
      return;
    }

    try {
      setLoadingUpload(true);

      const formData = new FormData();
      formData.append("userId", getDemoUserId());
      formData.append("file", selectedFile);

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

      const response = await fetch(`${apiBaseUrl}/cvs/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload CV file.");
      }

      const uploadedCV = extractCVFromResponse(data);

      setCv(uploadedCV);

      notifications.show({
        title: "CV uploaded",
        message: "File uploaded and text extracted successfully.",
        color: "green",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload CV file.",
      );
    } finally {
      setLoadingUpload(false);
    }
  }

  async function analyzeCV() {
    if (!cv?.id) {
      setError("Create or upload a CV first before analyzing it.");
      return;
    }

    setError("");

    try {
      setLoadingAnalyze(true);

      const response = await apiRequest<ApiResponse<AnalyzeCVResponse>>(
        `/cvs/${cv.id}/analyze?userId=${getDemoUserId()}`,
        {
          method: "POST",
        },
      );

      setAnalysis(response.data.analysis);
      setCandidateProfile(response.data.candidateProfile);

      notifications.show({
        title: "CV analyzed",
        message: "AI analysis completed successfully.",
        color: "blue",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze CV.");
    } finally {
      setLoadingAnalyze(false);
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
              leftSection={<IconFileAnalytics size={14} />}
            >
              CV Analyzer
            </Badge>

            <Title order={1} mt="md" fz={{ base: 38, md: 56 }} fw={900}>
              Analyze your CV with{" "}
              <span className="gradient-title">AI-powered feedback.</span>
            </Title>

            <Text c="dimmed" size="lg" mt="md" maw={760} lh={1.7}>
              Upload a PDF or DOCX file, or paste CV content, create a CV
              record, and generate a structured AI report with score, ATS
              compatibility, strengths, weaknesses, skills, and recommendations.
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
                    <Title order={3}>CV Input</Title>
                    <Badge variant="light">Step 1</Badge>
                  </Group>

                  <Card radius="lg" withBorder p="md" bg="gray.0">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <div>
                          <Text fw={800}>Upload CV file</Text>
                          <Text size="sm" c="dimmed">
                            Upload a PDF or DOCX file and HireLens will extract
                            the text.
                          </Text>
                        </div>
                        <Badge variant="light">Recommended</Badge>
                      </Group>

                      <FileInput
                        label="CV file"
                        placeholder="Choose PDF or DOCX"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        value={selectedFile}
                        onChange={setSelectedFile}
                        clearable
                      />

                      <Button loading={loadingUpload} onClick={uploadCVFile}>
                        Upload CV File
                      </Button>
                    </Stack>
                  </Card>

                  <Divider
                    label="or paste CV text manually"
                    labelPosition="center"
                  />

                  <TextInput
                    label="File name"
                    placeholder="My_CV.txt"
                    value={fileName}
                    onChange={(event) => setFileName(event.currentTarget.value)}
                  />

                  <Textarea
                    label="CV text"
                    placeholder="Paste your CV text here..."
                    minRows={14}
                    value={rawText}
                    onChange={(event) => setRawText(event.currentTarget.value)}
                  />

                  <Button
                    onClick={createCV}
                    loading={loadingCreate}
                    leftSection={<IconSparkles size={18} />}
                  >
                    Create CV From Text
                  </Button>

                  <Button
                    variant="default"
                    onClick={analyzeCV}
                    loading={loadingAnalyze}
                    disabled={!cv?.id}
                  >
                    Analyze CV
                  </Button>

                  {cv ? (
                    <Alert color="green" radius="md">
                      CV created successfully.
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
                      <Title order={3}>AI Analysis Result</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Generated from your backend CV Analyzer API.
                      </Text>
                    </div>

                    {analysis ? (
                      <Badge size="lg" color="green" variant="light">
                        Complete
                      </Badge>
                    ) : (
                      <Badge size="lg" color="gray" variant="light">
                        Waiting
                      </Badge>
                    )}
                  </Group>

                  {!analysis ? (
                    <Text c="dimmed" mt="xl">
                      Create a CV record and click Analyze CV to see the AI
                      report here.
                    </Text>
                  ) : (
                    <Stack mt="xl" gap="xl">
                      <Grid>
                        <GridCol span={{ base: 12, sm: 6 }}>
                          <Card radius="lg" withBorder>
                            <Text size="sm" fw={700} c="dimmed">
                              CV Score
                            </Text>
                            <Group justify="space-between" mt={8}>
                              <Text fz={34} fw={900}>
                                {analysis.score}%
                              </Text>
                            </Group>
                            <Progress value={analysis.score} mt="sm" />
                          </Card>
                        </GridCol>

                        <GridCol span={{ base: 12, sm: 6 }}>
                          <Card radius="lg" withBorder>
                            <Text size="sm" fw={700} c="dimmed">
                              ATS Compatibility
                            </Text>
                            <Group justify="space-between" mt={8}>
                              <Text fz={34} fw={900}>
                                {analysis.atsCompatibility}%
                              </Text>
                            </Group>
                            <Progress
                              value={analysis.atsCompatibility}
                              color="violet"
                              mt="sm"
                            />
                          </Card>
                        </GridCol>
                      </Grid>

                      <div>
                        <Title order={4}>Summary</Title>
                        <Text c="dimmed" mt="xs" lh={1.7}>
                          {analysis.summary}
                        </Text>
                      </div>

                      <Divider />

                      <Grid>
                        <GridCol span={{ base: 12, md: 6 }}>
                          <Title order={4}>Strengths</Title>
                          <List mt="sm" spacing="xs">
                            {analysis.strengths.map((item) => (
                              <List.Item key={item}>{item}</List.Item>
                            ))}
                          </List>
                        </GridCol>

                        <GridCol span={{ base: 12, md: 6 }}>
                          <Title order={4}>Weaknesses</Title>
                          <List mt="sm" spacing="xs">
                            {analysis.weaknesses.map((item) => (
                              <List.Item key={item}>{item}</List.Item>
                            ))}
                          </List>
                        </GridCol>
                      </Grid>

                      <Divider />

                      <Grid>
                        <GridCol span={{ base: 12, md: 6 }}>
                          <Title order={4}>Technical Skills</Title>
                          <Group mt="sm" gap="xs">
                            {analysis.skills.technical.map((skill) => (
                              <Badge key={skill} variant="light">
                                {skill}
                              </Badge>
                            ))}
                          </Group>
                        </GridCol>

                        <GridCol span={{ base: 12, md: 6 }}>
                          <Title order={4}>Soft Skills</Title>
                          <Group mt="sm" gap="xs">
                            {analysis.skills.soft.map((skill) => (
                              <Badge key={skill} color="violet" variant="light">
                                {skill}
                              </Badge>
                            ))}
                          </Group>
                        </GridCol>
                      </Grid>

                      <Divider />

                      <div>
                        <Title order={4}>Recommendations</Title>
                        <List mt="sm" spacing="xs">
                          {analysis.recommendations.map((item) => (
                            <List.Item key={item}>{item}</List.Item>
                          ))}
                        </List>
                      </div>
                    </Stack>
                  )}
                </Card>

                {candidateProfile ? (
                  <Card radius="xl" p="xl" withBorder className="glass-panel">
                    <Title order={3}>Candidate Profile</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                      This structured profile is used by the Job Matcher.
                    </Text>

                    <JsonInput
                      mt="md"
                      value={JSON.stringify(candidateProfile, null, 2)}
                      autosize
                      minRows={8}
                      readOnly
                    />
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
