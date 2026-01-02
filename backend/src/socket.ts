import { Server, Socket } from "socket.io";
import { RoomManager } from "./rooms/RoomManager";
import {
  CreateRoomPayload,
  JoinRoomPayload
} from "./contracts/events";

const roomManager = new RoomManager();

export function registerSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🟢 Jogador conectado:", socket.id);

    socket.on("CREATE_ROOM", (payload: CreateRoomPayload) => {
      const room = roomManager.criarSala(
        socket,
        payload.rodadas,
        payload.dificuldade
      );

      socket.emit("ROOM_CREATED", {
        roomId: room.id
      });

      console.log("🏠 Sala criada:", room.id);
    });

    socket.on("JOIN_ROOM", (payload: JoinRoomPayload) => {
      console.log("📥 JOIN_ROOM:", socket.id, payload.roomId);

      const room = roomManager.entrarSala(socket, payload.roomId);

      if (!room) {
        console.log("❌ Sala cheia ou inválida:", payload.roomId);
        socket.emit("JOIN_ROOM_ERROR", {
          message: "Sala inválida ou cheia"
        });
        return;
      }

      io.to(room.id).emit("PLAYER_JOINED", {
        jogadores: room.quantidadeJogadores
      });

      console.log("➕ Jogador entrou na sala:", room.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Jogador desconectado:", socket.id);
    });
  });
}
