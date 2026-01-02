import express from "express";
import { Server } from "socket.io";
import { registerSocket } from "./socket";

export const app = express();

const io = new Server({
  cors: {
    origin: "*"
  }
});

registerSocket(io);
