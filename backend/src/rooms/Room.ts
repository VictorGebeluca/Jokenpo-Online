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

    this.emitirEstado();

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

    this.fase = "aguardando_jogadores";
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

    const todosEscolheram = Array.from(this.escolhas.values()).every(
      e => e !== null
    );

    if (todosEscolheram) {
      this.fase = "jokenpo";
      this.emitirEstado(); // ⚠️ ainda sem revelar escolhas

      setTimeout(() => this.resolverRodada(), 2000);
    } else {
      this.emitirEstado(); // só status, sem revelar
    }
  }

  /* ========================= */
  /* RESULTADO */
  /* ========================= */
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

    this.emitirEstado(vencedorRodada);

    const pontosA = this.pontos.get(a.id)!;
    const pontosB = this.pontos.get(b.id)!;

    const alguemVenceu =
      pontosA >= this.rodadas || pontosB >= this.rodadas;

    if (alguemVenceu) {
      setTimeout(() => this.finalizarJogo(), 2000);
    } else {
      setTimeout(() => this.resetarRodada(), 2500);
    }
  }

  /* ========================= */
  /* RESET RODADA */
  /* ========================= */
  private resetarRodada() {
    this.escolhas.forEach((_, key) => this.escolhas.set(key, null));
    this.fase = "aguardando_jogadas";
    this.emitirEstado();
  }

  /* ========================= */
  /* FINAL */
  /* ========================= */
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
  /* RESET TOTAL */
  /* ========================= */
  reset() {
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
  /* EMISSÃO (SEM VAZAR ESCOLHA) */
  /* ========================= */
  emitirEstado(
    vencedorRodada?: string,
    vencedorFinal?: string
  ) {
    const estadoBase: EstadoSala = {
      fase: this.fase,
      escolhas: {},
      pontos: Object.fromEntries(this.pontos),
      jogadores: this.quantidadeJogadores,
      vencedorRodada,
      vencedorFinal,
    };

    this.jogadores.forEach(socket => {
      const escolhasVisiveis: Record<string, Escolha | null> = {};

      this.jogadores.forEach(j => {
        // 👇 só revela escolha do outro após resultado
        if (j.id === socket.id || this.fase === "resultado" || this.fase === "finalizado") {
          escolhasVisiveis[j.id] = this.escolhas.get(j.id) ?? null;
        } else {
          escolhasVisiveis[j.id] = null;
        }
      });

      socket.emit("room:state", {
        ...estadoBase,
        escolhas: escolhasVisiveis,
      });
    });
  }
}
