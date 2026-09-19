import { BASE_URL } from "@/app/constant/constant";
import { getAuthToken } from "./auth-token";

/**
 * ICE server configuration for WebRTC.
 *
 * The TURN username/password used to be hardcoded in the page components, which
 * meant they shipped inside the client bundle for anyone to read and reuse.
 *
 * The correct fix is short-lived credentials: coturn is run with
 * `use-auth-secret`, and the backend exposes an authenticated `GET /webrtc/ice`
 * that returns an HMAC username/password pair valid for a minute or two. That
 * is what `getIceServers()` asks for first.
 *
 * Until that endpoint exists it falls back to whatever is in the environment,
 * and finally to public STUN only. STUN-only still connects for most home
 * networks; it fails behind symmetric NAT, which is exactly what TURN is for.
 */
const STUN_ONLY: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

function staticFallback(): RTCIceServer[] {
  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const username = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const credential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  // Anything in NEXT_PUBLIC_* is still visible in the bundle. This is a
  // stop-gap so the secret can be rotated without a code change — not a fix.
  if (turnUrl && username && credential) {
    return [{ urls: turnUrl, username, credential }, ...STUN_ONLY];
  }
  return STUN_ONLY;
}

let cached: { servers: RTCIceServer[]; expiresAt: number } | null = null;

export async function getIceServers(): Promise<RTCConfiguration> {
  if (cached && cached.expiresAt > Date.now()) {
    return { iceServers: cached.servers };
  }

  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/webrtc/ice`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      const servers: RTCIceServer[] = data?.iceServers ?? data?.data?.iceServers;
      if (Array.isArray(servers) && servers.length > 0) {
        // Re-fetch a minute before the credentials lapse.
        const ttlSeconds = Number(data?.ttl ?? data?.data?.ttl ?? 300);
        cached = {
          servers,
          expiresAt: Date.now() + Math.max(ttlSeconds - 60, 30) * 1000,
        };
        return { iceServers: servers };
      }
    }
  } catch {
    // Endpoint not deployed yet, or unreachable — fall through.
  }

  return { iceServers: staticFallback() };
}
