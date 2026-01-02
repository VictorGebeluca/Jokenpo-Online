import { Socket } from "socket.io";
import { Dificuldade } from "../contracts/events";

export class Room {
  id: string;
  jogadores: Socket[] = [];
  rodadas: number;
  dificuldade: Dificuldade;

  constructor(
    id: string,
    criador: Socket,
    rodadas: number,
    dificuldade: Dificuldade
  ) {
    this.id = id;
    this.jogadores.push(criador);
    this.rodadas = rodadas;
    this.dificuldade = dificuldade;
  }

  adicionarJogador(socket: Socket) {
    if (this.jogadores.length >= 2) return false;
    this.jogadores.push(socket);
    return true;
  }

  get quantidadeJogadores() {
    return this.jogadores.length;
  }
}
