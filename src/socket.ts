import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  transports: ["websocket"]
});

// 👇 expõe no console (APENAS PARA DEBUG)
(window as any).socket = socket;

socket.on("connect", () => {
  console.log("🟢 Socket conectado:", socket.id);
});

socket.on("ROOM_CREATED", (data) => {
  console.log("🏠 Sala criada:", data.roomId);
});

socket.on("PLAYER_JOINED", (data) => {
  console.log("👥 Jogadores na sala:", data.jogadores);
});

socket.on("JOIN_ROOM_ERROR", (data) => {
  console.log("❌ Erro ao entrar na sala:", data.message);
});
