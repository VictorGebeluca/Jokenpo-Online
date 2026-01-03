import { Socket } from "socket.io";
import { Room } from "./Room";
import { Dificuldade } from "../contracts/events";

export class RoomManager {
  private rooms = new Map<string, Room>();
  private socketToRoom = new Map<string, string>();

  /* ========================= */
  /* CRIAR SALA */
  /* ========================= */
  criarSala(
    socket: Socket,
    rodadas: number,
    dificuldade: Dificuldade
  ): Room {
    const id = this.gerarId();

    const room = new Room(id, socket, rodadas, dificuldade);
    this.rooms.set(id, room);
    this.socketToRoom.set(socket.id, id);

    socket.join(id);

    return room;
  }

  /* ========================= */
  /* ENTRAR NA SALA */
  /* ========================= */
  entrarSala(socket: Socket, roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const entrou = room.adicionarJogador(socket);
    if (!entrou) return null;

    this.socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    return room;
  }

  /* ========================= */
  /* OBTER SALA */
  /* ========================= */
  get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /* ========================= */
  /* REMOVER JOGADOR */
  /* ========================= */
  removerJogador(socket: Socket): Room | null {
    const roomId = this.socketToRoom.get(socket.id);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.removerJogador(socket);
    this.socketToRoom.delete(socket.id);

    // se não sobrar ninguém, remove a sala
    if (room.quantidadeJogadores === 0) {
      this.rooms.delete(roomId);
      console.log("🗑️ Sala removida:", roomId);
    }

    return room;
  }

  /* ========================= */
  /* UTIL */
  /* ========================= */
  private gerarId(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}
