export type ErrorKind =
  | "invalid_credentials"
  | "validation"
  | "network"
  | "timeout"
  | "server"
  | "not_found"
  | "forbidden"
  | "unauthorized"
  | "conflict"
  | "rate_limited"
  | "unknown";

export const NETWORK_MESSAGE =
  "We couldn't reach the server. Check your internet connection, or the server may be offline right now.";
export const TIMEOUT_MESSAGE =
  "The server is taking too long to respond. It may still be starting up - please wait a moment and try again.";
export const SERVER_STARTING_HINT =
  "Still waiting... our server may be starting up. This can take up to a minute on the free plan.";
export const INVALID_CREDENTIALS_MESSAGE =
  "Incorrect email or password. Please check your details and try again.";

interface ErrorLike {
  response?: { data?: unknown; status?: number };
  message?: string;
  code?: string | number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Returns the trimmed text only when it is a meaningful, non-empty string. */
function toText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** Pulls a human-readable message out of the backend response body. */
export function extractServerMessage(data: unknown): string | null {
  if (typeof data === "string") {
    // Ignore HTML / huge payloads (e.g. proxy "deploying" pages).
    const trimmed = data.trim();
    if (trimmed && trimmed.length < 300 && !/^<[^>]*>/i.test(trimmed)) return trimmed;
    return null;
  }
  if (!isRecord(data)) return null;

  const candidates: unknown[] = [
    data.message,
    // `msg` is what this backend's sendResponse() helper uses.
    data.msg,
    data.error,
    data.detail,
    data.error_description,
    isRecord(data.data) ? data.data.message : undefined,
  ];
  for (const candidate of candidates) {
    const text = toText(candidate);
    if (text) return text;
  }
  return null;
}

/**
 * Classifies an error so the UI can decide how to present it.
 * `endpoint` is used to special-case the login endpoint (401 = bad credentials).
 */
export function getErrorKind(error: unknown, endpoint = ""): ErrorKind {
  const err = (error ?? {}) as ErrorLike;
  const code = typeof err.code === "string" ? err.code : String(err.code ?? "");
  const message = (err.message || "").toLowerCase();
  const status = err.response?.status;

  if (status === 401 && endpoint.includes("/auth/login")) return "invalid_credentials";

  if (!status) {
    if (
      code.toLowerCase() === "econnaborted" ||
      message.includes("timeout") ||
      message.includes("timed out")
    ) {
      return "timeout";
    }
    return "network";
  }

  if (status >= 500) return "server";
  switch (status) {
    case 400:
      return "validation";
    case 401:
      return "unauthorized";
    case 403:
      return "forbidden";
    case 404:
      return "not_found";
    case 409:
      return "conflict";
    case 422:
      return "validation";
    case 429:
      return "rate_limited";
    default:
      return "unknown";
  }
}

const KIND_MESSAGES: Record<Exclude<ErrorKind, "validation" | "unknown">, string> = {
  invalid_credentials: INVALID_CREDENTIALS_MESSAGE,
  network: NETWORK_MESSAGE,
  timeout: TIMEOUT_MESSAGE,
  server: "The server ran into an unexpected problem. Please try again in a few minutes.",
  not_found: "The requested information was not found on the server.",
  forbidden: "You don't have permission to do this.",
  unauthorized: "Your session has expired. Please log in again.",
  conflict:
    "This record already exists. For example, an account with this email may already be registered - try logging in instead.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
};

/**
 * Patterns that mean the string is internal diagnostic output rather than a
 * message written for a human user.
 */
const LEAKY_MESSAGE_PATTERNS = [
  /\bat\s+[\w$.]+\s*\(/, // stack frame: "at Object.handler (/srv/app.js:12:5)"
  /(^|\s)\/(usr|srv|home|var|opt|app|node_modules)\//,
  /[A-Za-z]:\\/, // windows path
  /\b(?:select|insert into|update .* set|delete from)\b.*\bfrom\b/i,
  /\b(?:ECONNREFUSED|ENOTFOUND|EAI_AGAIN|MongoError|SequelizeError|PrismaClient)\b/,
  /<\/?[a-z][\s\S]*>/i, // an HTML error page
  /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|redis|mysql):\/\//i,
];

const MAX_SERVER_MESSAGE_LENGTH = 200;

/**
 * A server-supplied string is only shown to the user when it is plausibly a
 * message *for* the user: a 4xx (something the caller can fix), short, and
 * free of diagnostic markers. Everything else falls back to our own copy.
 */
function isSafeServerMessage(message: string, status?: number): boolean {
  if (typeof status !== "number" || status < 400 || status >= 500) return false;
  if (message.length > MAX_SERVER_MESSAGE_LENGTH) return false;
  return !LEAKY_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

export interface GetErrorMessageOptions {
  /** Pass the endpoint (e.g. "/auth/login") so login gets special-cased. */
  endpoint?: string;
  fallback?: string;
}

/**
 * Returns a safe, non-empty, user-friendly error message.
 * Never returns an empty/whitespace string, which used to render as a thin
 * invisible red line on top of forms.
 */
export function getErrorMessage(
  error: unknown,
  options: GetErrorMessageOptions = {}
): string {
  const { endpoint = "", fallback = "Something went wrong. Please try again." } =
    options;
  const err = (error ?? {}) as ErrorLike;
  const kind = getErrorKind(error, endpoint);

  // Prefer the backend's own message, but only when it is something a user can
  // act on. A 5xx body is the server's crash report, not a UI string, and
  // pasting it on screen is how stack traces, SQL and file paths end up in a
  // client's screenshot.
  const serverMessage = extractServerMessage(err.response?.data);
  if (serverMessage && isSafeServerMessage(serverMessage, err.response?.status)) {
    return serverMessage;
  }

  if (kind === "validation") {
    // 400/422 without a message body: the form validation should say it all.
    return fallback;
  }
  if (kind === "unknown") return fallback;

  return KIND_MESSAGES[kind] ?? fallback;
}