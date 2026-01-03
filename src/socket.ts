import { io } from "socket.io-client";

/* ========================= */
/* SOCKET CLIENT */
/* ========================= */
export const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

/* ========================= */
/* DEBUG GLOBAL (DEV ONLY) */
/* ========================= */
(window as any).socket = socket;

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

/* ========================= */
/* SALAS */
/* ========================= */
socket.on("ROOM_CREATED", data => {
  console.log("🏠 Sala criada:", data.roomId);
});

socket.on("PLAYER_JOINED", data => {
  console.log("👥 Jogadores na sala:", data.jogadores);
});

socket.on("JOIN_ROOM_ERROR", data => {
  console.log("❌ Erro ao entrar na sala:", data.message);
});

/* ========================= */
/* ESTADO DO JOGO */
/* ========================= */
socket.on("room:state", estado => {
  console.log("🎮 Estado da sala:", estado);
});
