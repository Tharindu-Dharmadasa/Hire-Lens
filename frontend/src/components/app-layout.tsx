"use client";

import Link from "next/link";
import {
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" />

      <AppShell header={{ height: 72 }} padding={0}>
        <AppShell.Header>
          <Container size="lg" h="100%">
            <Group h="100%" justify="space-between">
              <Link href="/" className="brand-link">
                <div className="brand-mark">HL</div>
                <div>
                  <Title order={4} lh={1}>
                    HireLens
                  </Title>
                  <Text size="xs" c="dimmed" fw={600}>
                    AI Career Intelligence
                  </Text>
                </div>
              </Link>

              <Group gap="xs" visibleFrom="sm">
                <Button component={Link} href="/" variant="subtle">
                  Home
                </Button>
                <Button component={Link} href="/cv-analyzer" variant="subtle">
                  CV Analyzer
                </Button>
                <Button component={Link} href="/job-matcher" variant="subtle">
                  Job Matcher
                </Button>
                <Button
                  component={Link}
                  href="/interview-coach"
                  variant="subtle"
                >
                  Interview Coach
                </Button>
              </Group>

              <Button component={Link} href="/cv-analyzer" visibleFrom="sm">
                Start Demo
              </Button>

              <Burger hiddenFrom="sm" size="sm" />
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>{children}</AppShell.Main>
        <footer style={{ padding: "2rem 0", textAlign: "center" }}>
          <Text size="sm" c="dimmed">
            HireLens — AI Career Intelligence Platform built with Next.js,
            Express, Prisma, PostgreSQL, and Gemini AI.
          </Text>
        </footer>
      </AppShell>
    </MantineProvider>
  );
}
