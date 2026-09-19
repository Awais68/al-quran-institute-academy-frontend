import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "@/app/constant/constant";
import { getAuthToken } from "./auth-token";

/**
 * Single shared Socket.IO connection for the whole app.
 *
 * Two problems this solves:
 *
 * 1. Authentication. Every connection now sends the JWT in the handshake
 *    (`auth.token`). The server is expected to verify it in an `io.use()`
 *    middleware and derive the user identity from the token — NOT from the
 *    `register-user` payload, which any client can forge.
 *
 * 2. Connection count. Every page used to call `io(SOCKET_URL)` on its own, so
 *    a single dashboard could hold three or four sockets open at once. Feature
 *    code now attaches listeners to this one connection and detaches them on
 *    unmount; it must never call `disconnect()` on it. Only `closeSocket()`
 *    (on logout) tears the connection down.
 *
 * `auth` is passed as a callback so socket.io re-reads the token on every
 * reconnect attempt — after a re-login the new token is used automatically.
 */
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: (cb) => cb({ token: getAuthToken() ?? "" }),
      // Keep polling as a fallback: some corporate proxies block raw websockets.
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

/** Tear the shared connection down. Call this on logout only. */
export function closeSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/**
 * Re-run the handshake with the current token. Call after login so the server
 * re-authenticates an already-open (anonymous) connection.
 */
export function refreshSocketAuth() {
  if (socket) {
    socket.disconnect().connect();
  }
}
