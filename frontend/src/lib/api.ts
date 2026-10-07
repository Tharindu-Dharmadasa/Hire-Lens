const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data as T;
}

export function getDemoUserId(): string {
  const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID;

  if (!userId) {
    throw new Error("NEXT_PUBLIC_DEMO_USER_ID is not configured");
  }

  return userId;
}
