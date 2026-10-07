"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  GridCol,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBriefcase,
  IconFileAnalytics,
  IconMessageQuestion,
  IconSparkles,
} from "@tabler/icons-react";

const features = [
  {
    title: "CV Analyzer",
    description:
      "Analyze CV quality, ATS compatibility, strengths, weaknesses, skills, and improvement recommendations.",
    icon: IconFileAnalytics,
    href: "/cv-analyzer",
  },
  {
    title: "Job Matcher",
    description:
      "Compare your candidate profile with job descriptions and identify matched and missing skills.",
    icon: IconBriefcase,
    href: "/job-matcher",
  },
  {
    title: "Interview Coach",
    description:
      "Generate interview questions, practise answers, and receive AI score plus feedback.",
    icon: IconMessageQuestion,
    href: "/interview-coach",
  },
];

export default function HomePage() {
  return (
    <main className="hero-shell">
      <Container size="lg">
        <Grid align="center" gutter={48}>
          <GridCol span={{ base: 12, md: 7 }}>
            <Stack gap="xl">
              <Badge
                size="lg"
                radius="xl"
                variant="light"
                leftSection={<IconSparkles size={14} />}
              >
                AI-powered career intelligence
              </Badge>

              <Title order={1} fz={{ base: 44, md: 72 }} lh={0.95} fw={900}>
                Build a sharper career profile with{" "}
                <span className="gradient-title">AI insight.</span>
              </Title>

              <Text size="lg" c="dimmed" maw={640} lh={1.8}>
                HireLens helps candidates analyze CVs, compare job
                opportunities, and practise interview answers using a
                role-agnostic AI career intelligence platform.
              </Text>

              <Group>
                <Button
                  component={Link}
                  href="/cv-analyzer"
                  size="lg"
                  radius="md"
                  rightSection="→"
                >
                  Analyze CV
                </Button>

                <Button
                  component={Link}
                  href="/interview-coach"
                  size="lg"
                  radius="md"
                  variant="default"
                >
                  Try Interview Coach
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                {[
                  ["3", "AI modules"],
                  ["8", "Database models"],
                  ["100", "Score insights"],
                ].map(([value, label]) => (
                  <Card
                    key={label}
                    radius="lg"
                    withBorder
                    className="glass-panel"
                  >
                    <Text fz={34} fw={900} lh={1}>
                      {value}
                    </Text>
                    <Text size="sm" c="dimmed" fw={600} mt={6}>
                      {label}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 7 }}>
            <Card radius={28} p="xl" className="glass-panel">
              <Card radius="xl" p="xl" bg="dark.9" c="white">
                <Group justify="space-between" mb="lg">
                  <div>
                    <Text size="sm" c="blue.2" fw={700}>
                      HireLens AI Report
                    </Text>
                    <Title order={2}>Candidate Snapshot</Title>
                  </div>

                  <Badge color="green" variant="light">
                    Live MVP
                  </Badge>
                </Group>

                <Stack gap="lg">
                  {[
                    ["CV Score", 82, "blue"],
                    ["Job Match", 76, "violet"],
                    ["Interview Answer", 88, "green"],
                  ].map(([label, value, color]) => (
                    <div key={label}>
                      <Group justify="space-between" mb={8}>
                        <Text size="sm" c="gray.4" fw={600}>
                          {label}
                        </Text>
                        <Text fz={24} fw={900}>
                          {value}%
                        </Text>
                      </Group>
                      <Progress value={Number(value)} color={String(color)} />
                    </div>
                  ))}

                  <Card radius="lg" bg="blue.1" c="gray.7" p="md">
                    <Text size="sm" fw={700} lh={1.7}>
                      Strong full-stack foundation. Improve interview answers by
                      adding measurable results, clearer trade-offs, and project
                      impact.
                    </Text>
                  </Card>
                </Stack>
              </Card>
            </Card>
          </GridCol>
        </Grid>

        <SimpleGrid cols={{ base: 1, md: 3 }} mt={64}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                component={Link}
                href={feature.href}
                radius="xl"
                p="xl"
                withBorder
                className="glass-panel"
              >
                <ThemeIcon size={54} radius="lg" color="dark">
                  <Icon size={28} />
                </ThemeIcon>

                <Title order={3} mt="lg">
                  {feature.title}
                </Title>

                <Text c="dimmed" mt="sm" lh={1.7}>
                  {feature.description}
                </Text>

                <Text mt="lg" fw={800} c="blue">
                  Open module →
                </Text>
              </Card>
            );
          })}
        </SimpleGrid>

        <Card radius="xl" p="xl" mt={64} withBorder className="glass-panel">
          <Grid align="center">
            <GridCol span={{ base: 12, md: 7 }}>
              <Badge variant="light" mb="md">
                Tech Stack
              </Badge>
              <Title order={2}>Built with modern web technologies and AI</Title>
            </GridCol>

            <GridCol span={{ base: 12, md: 7 }}>
              <Group gap="sm">
                {[
                  "Next.js",
                  "TypeScript",
                  "Express",
                  "Prisma",
                  "PostgreSQL",
                  "Gemini AI",
                  "Docker",
                  "Postman",
                ].map((tech) => (
                  <Badge key={tech} size="lg" variant="light">
                    {tech}
                  </Badge>
                ))}
              </Group>
            </GridCol>
          </Grid>
        </Card>
      </Container>
    </main>
  );
}
