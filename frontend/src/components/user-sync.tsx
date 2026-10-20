"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { apiRequest } from "../lib/api";

export function UserSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;

    let cancelled = false;

    async function synchronize() {
      try {
        const token = await getToken();

        if (!token || cancelled) return;

        await apiRequest("/users/sync", token, {
          method: "POST",
        });

        if (!cancelled) {
          console.log("HireLens user synchronized");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("HireLens user synchronization failed:", error);
        }
      }
    }

    void synchronize();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  return null;
}
