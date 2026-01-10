import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { registerSocket } from "./socket";

const app = express();
const server = http.createServer(app);

/* ========================= */
/* SOCKET.IO */
/* ========================= */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerSocket(io);

/* ========================= */
/* HEALTH CHECK */
/* ========================= */
app.get("/", (_req: Request, res: Response) => {
  res.send("🟢 Jokenpo Backend Online");
});

/* ========================= */
/* START SERVER */
/* ========================= */
const PORT = Number(process.env.PORT) || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
