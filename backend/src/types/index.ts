/**
 * Shared Type Definitions
 */

export interface ApiResponse<T> {
  status: "ok" | "error";
  message?: string;
  data?: T;
}

export interface HealthResponse {
  status: "ok";
  service: string;
}

export interface IHealthService {
  getHealth(): Promise<HealthResponse>;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
  code?: string;
}
