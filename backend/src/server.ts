import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { registerSocket } from "./socket";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

registerSocket(io);

// 📌 caminho correto para o dist do frontend
const frontendPath = path.resolve(__dirname, "../../dist");

app.use(express.static(frontendPath));

// fallback SPA (React)
app.get("*", (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
console.log("🔥 BACKEND ATUALIZADO", new Date().toISOString());

export { server };
