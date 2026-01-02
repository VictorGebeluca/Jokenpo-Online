import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  transports: ["websocket"]
});

// expõe no console (só para teste)
(window as any).socket = socket;

socket.on("connect", () => {
  console.log("🟢 Socket conectado:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("🔴 Erro socket:", err.message);
});
