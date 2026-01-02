import express from "express";
import { Server } from "socket.io";
import http from "http";
import { registerSocket } from "./socket";

export const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // depois a gente restringe
    methods: ["GET", "POST"]
  }
});

registerSocket(io);

export { server };
