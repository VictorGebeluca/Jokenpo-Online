import { Server, Socket } from "socket.io";

export function registerSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🟢 Jogador conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Jogador desconectado:", socket.id);
    });
  });
}
