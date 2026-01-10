import { io } from "socket.io-client";

/* ========================= */
/* SOCKET URL */
/* ========================= */
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

/* ========================= */
/* SOCKET CLIENT */
/* ========================= */
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

/* ========================= */
/* DEBUG GLOBAL (DEV ONLY) */
/* ========================= */
if (import.meta.env.DEV) {
  (window as any).socket = socket;
}

/* ========================= */
/* LIFECYCLE */
/* ========================= */
socket.on("connect", () => {
  console.log("🟢 Socket conectado:", socket.id);
});

socket.on("disconnect", reason => {
  console.log("🔴 Socket desconectado:", reason);
});

socket.on("connect_error", err => {
  console.error("❌ Erro de conexão socket:", err.message);
});
