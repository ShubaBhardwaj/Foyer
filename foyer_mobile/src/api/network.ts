import { AxiosError } from "axios";

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

/**
  Normalizes any unknown error or AxiosError into a standard ApiError object.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (!error) {
    return {
      status: 500,
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred.",
    };
  }

  const isAxiosError = (err: unknown): err is AxiosError<Record<string, unknown>> => {
    return typeof err === "object" && err !== null && "isAxiosError" in err && (err as { isAxiosError: boolean }).isAxiosError === true;
  };

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    // Handle Network Offline / Timeout
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return {
        status: 408,
        code: "TIMEOUT",
        message: "The request timed out. Please check your internet connection and try again.",
        isTimeout: true,
      };
    }

    if (!error.response && error.request) {
      return {
        status: 0,
        code: "NETWORK_OFFLINE",
        message: "Unable to connect to the server. Please check your network connection.",
        isNetworkError: true,
      };
    }

    // Extract server message and code from both direct data and backend error object envelope
    const rawErrorObj = (data as any)?.error;
    const serverMessage = typeof data?.message === "string" 
      ? data.message 
      : typeof rawErrorObj?.message === "string" 
        ? rawErrorObj.message 
        : undefined;
    const serverCode = typeof data?.code === "string" 
      ? data.code 
      : typeof rawErrorObj?.code === "string" 
        ? rawErrorObj.code 
        : undefined;
    const details = typeof data?.details === "object" && data.details !== null 
      ? (data.details as Record<string, unknown>) 
      : typeof rawErrorObj?.details === "object" && rawErrorObj?.details !== null
        ? (rawErrorObj.details as Record<string, unknown>)
        : undefined;


    switch (status) {
      case 401:
        return {
          status: 401,
          code: serverCode || "UNAUTHORIZED",
          message: serverMessage || "Session expired. Please log in again.",
          details,
        };
      case 403:
        return {
          status: 403,
          code: serverCode || "FORBIDDEN",
          message: serverMessage || "You do not have permission to perform this action.",
          details,
        };
      case 404:
        return {
          status: 404,
          code: serverCode || "NOT_FOUND",
          message: serverMessage || "The requested resource was not found.",
          details,
        };
      case 422:
        return {
          status: 422,
          code: serverCode || "VALIDATION_ERROR",
          message: serverMessage || "Validation failed. Please check your inputs.",
          details,
        };
      case 429:
        return {
          status: 429,
          code: serverCode || "RATE_LIMITED",
          message: serverMessage || "Too many requests. Please slow down.",
          details,
        };
      case 500:
      default:
        return {
          status: status || 500,
          code: serverCode || "SERVER_ERROR",
          message: serverMessage || "A server error occurred. Please try again later.",
          details,
        };
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      code: "CLIENT_ERROR",
      message: error.message,
    };
  }

  return {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: String(error),
  };
}

/**
 * Determines whether a failed request is suitable for exponential backoff retries.
 */
export function isRetryableError(error: ApiError): boolean {
  if (error.isNetworkError || error.isTimeout) return true;
  if (error.status >= 500 && error.status <= 599) return true;
  if (error.status === 429) return true;
  return false;
}
