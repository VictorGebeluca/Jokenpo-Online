import { Socket } from "socket.io";
import { Dificuldade } from "../contracts/events";

/* ========================= */
/* TIPOS */
/* ========================= */
export type Escolha = "pedra" | "papel" | "tesoura";
export type Fase =
  | "aguardando_jogadores"
  | "aguardando_jogadas"
  | "jokenpo"
  | "resultado"
  | "finalizado";

interface EstadoSala {
  fase: Fase;
  escolhas: Record<string, Escolha | null>;
  pontos: Record<string, number>;
  jogadores: number;
  vencedorRodada?: string;
  vencedorFinal?: string;
}

/* ========================= */
/* REGRAS */
/* ========================= */
function decidirRodada(a: Escolha, b: Escolha): "empate" | "a" | "b" {
  if (a === b) return "empate";
  if (
    (a === "pedra" && b === "tesoura") ||
    (a === "papel" && b === "pedra") ||
    (a === "tesoura" && b === "papel")
  ) {
    return "a";
  }
  return "b";
}

/* ========================= */
/* ROOM */
/* ========================= */
export class Room {
  id: string;
  jogadores: Socket[] = [];
  rodadas: number;
  dificuldade: Dificuldade;

  private fase: Fase = "aguardando_jogadores";
  private escolhas = new Map<string, Escolha | null>();
  private pontos = new Map<string, number>();
  private rodadaAtual = 0;

  constructor(
    id: string,
    criador: Socket,
    rodadas: number,
    dificuldade: Dificuldade
  ) {
    this.id = id;
    this.rodadas = rodadas;
    this.dificuldade = dificuldade;

    this.adicionarJogador(criador);
  }

  /* ========================= */
  /* JOGADORES */
  /* ========================= */
  adicionarJogador(socket: Socket) {
    if (this.jogadores.length >= 2) return false;

    this.jogadores.push(socket);
    this.escolhas.set(socket.id, null);
    this.pontos.set(socket.id, 0);

    // 1️⃣ Sempre emite o estado atual ao entrar
    this.emitirEstado();

    // 2️⃣ Só depois que os DOIS já receberam o estado,
    // muda para aguardando_jogadas
    if (this.jogadores.length === 2) {
      setTimeout(() => {
        this.fase = "aguardando_jogadas";
        this.emitirEstado();
      }, 0);
    }

    return true;
  }

  removerJogador(socket: Socket) {
    this.jogadores = this.jogadores.filter(j => j.id !== socket.id);
    this.escolhas.delete(socket.id);
    this.pontos.delete(socket.id);

    if (this.jogadores.length < 2) {
      this.fase = "aguardando_jogadores";
    }

    this.emitirEstado();
  }

  get quantidadeJogadores() {
    return this.jogadores.length;
  }

  /* ========================= */
  /* JOGADA */
  /* ========================= */
  escolher(socket: Socket, escolha: Escolha) {
    if (this.fase !== "aguardando_jogadas") return;
    if (!this.escolhas.has(socket.id)) return;

    this.escolhas.set(socket.id, escolha);

    const todasEscolhas = Array.from(this.escolhas.values()).every(
      e => e !== null
    );

    if (todasEscolhas) {
      this.fase = "jokenpo";
      this.emitirEstado();

      setTimeout(() => this.resolverRodada(), 2000);
    } else {
      this.emitirEstado();
    }
  }

  private resolverRodada() {
    if (this.jogadores.length < 2) return;

    this.fase = "resultado";

    const [a, b] = this.jogadores;
    const escolhaA = this.escolhas.get(a.id)!;
    const escolhaB = this.escolhas.get(b.id)!;

    const resultado = decidirRodada(escolhaA, escolhaB);

    let vencedorRodada: string | undefined;

    if (resultado === "a") {
      this.pontos.set(a.id, this.pontos.get(a.id)! + 1);
      vencedorRodada = a.id;
    }

    if (resultado === "b") {
      this.pontos.set(b.id, this.pontos.get(b.id)! + 1);
      vencedorRodada = b.id;
    }

    this.rodadaAtual++;

    this.emitirEstado(vencedorRodada);

    if (this.rodadaAtual >= this.rodadas) {
      setTimeout(() => this.finalizarJogo(), 2000);
    } else {
      setTimeout(() => this.resetarRodada(), 2500);
    }
  }

  private resetarRodada() {
    this.escolhas.forEach((_, key) => this.escolhas.set(key, null));
    this.fase = "aguardando_jogadas";
    this.emitirEstado();
  }

  private finalizarJogo() {
    this.fase = "finalizado";

    const [a, b] = this.jogadores;
    const pontosA = this.pontos.get(a.id)!;
    const pontosB = this.pontos.get(b.id)!;

    let vencedorFinal: string | undefined;

    if (pontosA > pontosB) vencedorFinal = a.id;
    if (pontosB > pontosA) vencedorFinal = b.id;

    this.emitirEstado(undefined, vencedorFinal);
  }

  /* ========================= */
  /* RESET */
  /* ========================= */
  reset() {
    this.rodadaAtual = 0;

    this.escolhas.clear();
    this.pontos.clear();

    this.jogadores.forEach(j => {
      this.escolhas.set(j.id, null);
      this.pontos.set(j.id, 0);
    });

    this.fase =
      this.jogadores.length === 2
        ? "aguardando_jogadas"
        : "aguardando_jogadores";

    this.emitirEstado();
  }

  /* ========================= */
  /* EMISSÃO */
  /* ========================= */
  emitirEstado(
    vencedorRodada?: string,
    vencedorFinal?: string
  ) {
    const estado: EstadoSala = {
      fase: this.fase,
      escolhas: Object.fromEntries(this.escolhas),
      pontos: Object.fromEntries(this.pontos),
      jogadores: this.quantidadeJogadores,
      vencedorRodada,
      vencedorFinal,
    };

    this.jogadores.forEach(socket => {
      socket.emit("room:state", estado);
    });
  }
}
