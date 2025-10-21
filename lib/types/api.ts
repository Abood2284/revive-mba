// lib/types/api.ts
// Purpose: Standardized API response types and utilities for all endpoints

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Response builders
export function createSuccessResponse<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(
  error: string,
  fieldErrors?: Record<string, string[]>
): ApiError {
  return {
    success: false,
    error,
    ...(fieldErrors && { fieldErrors }),
  };
}

// Validation error formatter
export function formatValidationErrors(
  issues: Array<{ path: (string | number)[]; message: string }>
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  });

  return fieldErrors;
}
