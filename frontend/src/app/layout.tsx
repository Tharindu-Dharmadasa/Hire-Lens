import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AppLayout } from "../components/app-layout";
import { UserSync } from "../components/user-sync";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireLens | AI-Powered Career Intelligence",
  description:
    "Analyze your CV, match jobs with AI, and prepare for interviews with HireLens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <UserSync />
          <AppLayout>{children}</AppLayout>
        </ClerkProvider>
      </body>
    </html>
  );
}
