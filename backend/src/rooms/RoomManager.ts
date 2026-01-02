import { Socket } from "socket.io";
import { Room } from "./Room";
import { Dificuldade } from "../contracts/events";

export class RoomManager {
  private rooms = new Map<string, Room>();

  criarSala(
    socket: Socket,
    rodadas: number,
    dificuldade: Dificuldade
  ): Room {
    const id = this.gerarId();
    const room = new Room(id, socket, rodadas, dificuldade);

    this.rooms.set(id, room);
    socket.join(id);

    return room;
  }

  entrarSala(socket: Socket, roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const entrou = room.adicionarJogador(socket);
    if (!entrou) return null;

    socket.join(roomId);
    return room;
  }

  getSala(roomId: string) {
    return this.rooms.get(roomId);
  }

  private gerarId(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}
