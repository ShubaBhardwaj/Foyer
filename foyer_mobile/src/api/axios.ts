import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { normalizeApiError } from "./network";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8002";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let getTokenFn: (() => Promise<string | null>) | null = null;

/**
 * Registers the Clerk auth token retriever function.
 */
export function setAuthTokenProvider(provider: () => Promise<string | null>): void {
  getTokenFn = provider;
}

// Request Interceptor: Inject Bearer JWT Token if available
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn("Failed to retrieve authentication token for request:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

// Response Interceptor: Normalize all errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export default apiClient;
