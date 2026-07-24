import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Function holder for Clerk token getter registered by AuthProvider
let tokenGetter: (() => Promise<string | null>) | null = null;

export const registerClerkTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (tokenGetter) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("[AxiosClient] Error fetching Clerk token:", err);
      }
    } else if (typeof window !== "undefined" && (window as any).Clerk?.session) {
      try {
        const token = await (window as any).Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("[AxiosClient] Error fetching token from global Clerk:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "An unexpected error occurred.";

      switch (status) {
        case 401:
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            toast.error("Session expired or unauthorized. Please sign in again.");
            window.location.href = "/login";
          }
          break;
        case 403:
          toast.error(`Forbidden: ${message}`);
          break;
        case 404:
          toast.error(`Not Found: ${message}`);
          break;
        case 409:
          toast.error(`Conflict Error: ${message}`);
          break;
        case 422:
          toast.error(`Validation Error: ${message}`);
          break;
        case 500:
        default:
          toast.error(`Server Error: ${message}`);
          break;
      }
    } else if (error.request) {
      toast.error("Network error: Unable to reach the Foyer server. Please check your connection.");
    } else {
      toast.error(error.message || "An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);
