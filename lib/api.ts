import axios, { AxiosError, type AxiosResponse } from 'axios';
import { BASE_URL } from '@/app/constant/constant';
import { clearAuthToken, getAuthToken } from '@/lib/auth-token';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for sending cookies with requests
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Path of the page that lets a user set a new password. */
export const CHANGE_PASSWORD_PATH = '/change-password';

/**
 * The backend answers 403 with this code for every request made by an account
 * that still carries `mustResetPassword` (an admin-created teacher who has not
 * changed the generated password yet). Only POST /auth/change-password is
 * exempt, so the only way forward is that page.
 */
export const PASSWORD_RESET_CODE = 'PASSWORD_RESET_REQUIRED';

export function isPasswordResetRequired(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (error.response?.status !== 403) return false;
  const body = error.response.data as { data?: { code?: string } } | undefined;
  return body?.data?.code === PASSWORD_RESET_CODE;
}

/** Statuses that are worth retrying when the server wakes up or is overloaded. */
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

/** True when the server was never reached (network/timeout) or returned a transient status. */
export function isRetryableError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (error.code === 'ERR_CANCELED') return false;
  if (!error.response) return true;
  return RETRYABLE_STATUS.has(error.response.status);
}

export interface RetryOptions {
  /** Extra attempts after the first try. Defaults to 1. */
  retries?: number;
  /** Base delay in ms before the first retry (doubles each attempt). Defaults to 2000. */
  retryDelay?: number;
  /** Called before each retry so the UI can show "server is starting up...". */
  onRetry?: (attempt: number) => void;
}

/**
 * POST helper that automatically retries when the server is unreachable or
 * still waking up (e.g. a sleeping free-tier backend). Safe to retry POST
 * only for idempotent-seeming actions like login, where a duplicate attempt
 * is harmless. Use plain `apiClient.post` for things like signup/contact that
 * must never double-submit.
 */
export async function postWithRetry<T = any>(
  url: string,
  data?: any,
  options: RetryOptions = {}
): Promise<AxiosResponse<T>> {
  const { retries = 1, retryDelay = 2000, onRetry } = options;
  let attempt = 0;

  for (;;) {
    try {
      return await apiClient.post<T>(url, data);
    } catch (error) {
      const isLastAttempt = attempt >= retries;
      if (!isRetryableError(error) || isLastAttempt) throw error;
      attempt += 1;
      onRetry?.(attempt);
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
    }
  }
}

export type { AxiosError };

// Request interceptor to add authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      // Only clear the token when an authenticated request fails. On login a 401
      // means wrong credentials, and on change-password it means the *current*
      // password was mistyped — neither says anything about the session, and
      // both are handled by the form's catch block.
      const isCredentialCheck =
        url.includes('/auth/login') || url.includes('/auth/change-password');
      if (!isCredentialCheck && getAuthToken()) {
        clearAuthToken();
      }
    }

    // A pending password reset blocks every other endpoint, so there is nothing
    // any page can do about this error except send the user to the form. The
    // token stays put — it is still valid, and the form needs it.
    if (isPasswordResetRequired(error) && typeof window !== 'undefined') {
      if (window.location.pathname !== CHANGE_PASSWORD_PATH) {
        window.location.assign(CHANGE_PASSWORD_PATH);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;