"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  AppShell,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { Notifications } from "@mantine/notifications";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "CV Analyzer", href: "/cv-analyzer" },
  { label: "Job Matcher", href: "/job-matcher" },
  { label: "Interview Coach", href: "/interview-coach" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpened(false);

  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" />

      <AppShell header={{ height: 72 }} padding={0}>
        <AppShell.Header>
          <Container size="lg" h="100%">
            <Group h="100%" justify="space-between" wrap="nowrap">
              {/* Brand */}
              <Link href="/" className="brand-link" onClick={closeMobileMenu}>
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

              {/* Desktop navigation */}
              <Group gap="xs" visibleFrom="sm">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    variant="subtle"
                  >
                    {link.label}
                  </Button>
                ))}
              </Group>

              {/* Authentication */}
              <Group gap="sm" wrap="nowrap">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="default" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button size="sm">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <UserButton />
                </SignedIn>
              </Group>

              {/* Existing desktop button */}
              <Button
                disabled
                component={Link}
                href="/cv-analyzer"
                visibleFrom="sm"
              >
                Start Demo
              </Button>

              {/* Functional mobile hamburger */}
              <Burger
                opened={mobileMenuOpened}
                onClick={() => setMobileMenuOpened((previous) => !previous)}
                hiddenFrom="sm"
                size="sm"
                aria-label={
                  mobileMenuOpened
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
              />
            </Group>
          </Container>
        </AppShell.Header>

        {/* Mobile navigation drawer */}
        <Drawer
          opened={mobileMenuOpened}
          onClose={closeMobileMenu}
          title="HireLens Navigation"
          fw={1000}
          position="right"
          size="80%"
          padding="md"
          hiddenFrom="sm"
          zIndex={1000}
        >
          <Stack gap="sm">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                variant={pathname === link.href ? "light" : "subtle"}
                fullWidth
                justify="flex-start"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Drawer>

        <AppShell.Main>{children}</AppShell.Main>

        <footer
          style={{
            padding: "2rem 0",
            textAlign: "center",
          }}
        >
          <Text size="sm" c="dimmed">
            HireLens — AI Career Intelligence Platform built with Next.js,
            Express, Prisma, PostgreSQL, and Gemini AI.
          </Text>
        </footer>
      </AppShell>
    </MantineProvider>
  );
}
