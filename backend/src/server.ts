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

// 👉 aponta para o dist da RAIZ
const frontendPath = path.join(__dirname, "../../dist");

app.use(express.static(frontendPath));

// fallback para SPA
app.get("*", (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export { server };
