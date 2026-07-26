import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { normalizeApiError } from "./network";

function resolveApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.37:8002";

  // If pointing to localhost/127.0.0.1, attempt to resolve Expo debugger host IP for physical devices
  if (envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (hostUri) {
      const hostIp = hostUri.split(":")[0];
      if (hostIp && hostIp !== "localhost" && hostIp !== "127.0.0.1") {
        const portMatch = envUrl.match(/:(\d+)/);
        const port = portMatch ? portMatch[1] : "8002";
        return `http://${hostIp}:${port}`;
      }
    }
  }

  return envUrl;
}

const API_URL = resolveApiUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let getTokenFn: (() => Promise<string | null>) | null = null;
let unauthenticatedHandler: (() => void) | null = null;

/**
 * Registers the Clerk auth token retriever function.
 */
export function setAuthTokenProvider(provider: () => Promise<string | null>): void {
  getTokenFn = provider;
}

/**
 * Registers global unauthenticated (401) handler to trigger full app logout.
 */
export function setUnauthenticatedHandler(handler: () => void): void {
  unauthenticatedHandler = handler;
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

// Response Interceptor: Normalize all errors & trigger auto-logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error);
    if (normalized.status === 401 && unauthenticatedHandler) {
      console.warn("[Axios] Received 401 Unauthorized from backend — triggering unauthenticated handler.");
      unauthenticatedHandler();
    }
    return Promise.reject(normalized);
  }
);

export default apiClient;
