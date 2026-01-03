import express from "express";
import http from "http";
import { Server } from "socket.io";
import { registerSocket } from "./socket";

const app = express();
const server = http.createServer(app);

/* ========================= */
/* SOCKET.IO (CORS CORRETO) */
/* ========================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend (Vite)
    methods: ["GET", "POST"],
  },
});

/* ========================= */
/* SOCKET HANDLERS */
/* ========================= */
registerSocket(io);

/* ========================= */
/* ROTAS HTTP (OPCIONAL) */
/* ========================= */
app.get("/", (_req, res) => {
  res.send("🟢 Jokenpo Backend Online");
});

/* ========================= */
/* START SERVER */
/* ========================= */
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
