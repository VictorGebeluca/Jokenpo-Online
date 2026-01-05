import { Server, Socket } from "socket.io";
import { RoomManager } from "./rooms/RoomManager";
import type { Escolha } from "./rooms/Room";
import {
  CreateRoomPayload,
  JoinRoomPayload,
} from "./contracts/events";

const roomManager = new RoomManager();

export function registerSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🟢 Jogador conectado:", socket.id);

    /* ========================= */
    /* CRIAR SALA */
    /* ========================= */
    socket.on("CREATE_ROOM", (payload: CreateRoomPayload) => {
      const room = roomManager.criarSala(
        socket,
        payload.rodadas,
        payload.dificuldade
      );

      socket.join(room.id);

      socket.emit("ROOM_CREATED", {
        roomId: room.id,
      });

      console.log("🏠 Sala criada:", room.id);
    });

    /* ========================= */
    /* ENTRAR NA SALA */
    /* ========================= */
    socket.on("JOIN_ROOM", (payload: JoinRoomPayload) => {
      console.log("📥 JOIN_ROOM:", socket.id, payload.roomId);

      const room = roomManager.entrarSala(socket, payload.roomId);

      if (!room) {
        socket.emit("JOIN_ROOM_ERROR", {
          message: "Sala inválida ou cheia",
        });
        return;
      }

      socket.join(room.id);

      socket.emit("JOIN_ROOM_SUCCESS", {
        roomId: room.id,
      });

      console.log("➕ Jogador entrou na sala:", room.id);
    });

    /* ========================= */
    /* 🔥 PEDIR ESTADO ATUAL (REFRESH SAFE) */
    /* ========================= */
    socket.on("room:get_state", ({ roomId }) => {
  const room = roomManager.get(roomId);
  if (!room) return;

  room.emitirEstado();
});


    /* ========================= */
    /* ESCOLHA DE JOGADA */
    /* ========================= */
    socket.on(
      "room:choice",
      ({ roomId, escolha }: { roomId: string; escolha: Escolha }) => {
        const room = roomManager.get(roomId);
        if (!room) return;

        room.escolher(socket, escolha);
      }
    );

    /* ========================= */
    /* REINICIAR */
    /* ========================= */
    socket.on("room:restart", ({ roomId }: { roomId: string }) => {
      const room = roomManager.get(roomId);
      if (!room) return;

      room.reset();
    });

    /* ========================= */
    /* DISCONNECT */
    /* ========================= */
    socket.on("disconnect", () => {
      console.log("🔴 Jogador desconectado:", socket.id);

      const room = roomManager.removerJogador(socket);
      if (!room) return;

      socket.leave(room.id);

      room.jogadores.forEach(j =>
        j.emit("PLAYER_LEFT", { socketId: socket.id })
      );
    });
  });
}
