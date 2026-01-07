import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { Escolha } from "../game/regras";

/* ========================= */
/* TIPOS */
/* ========================= */
export type Fase =
  | "aguardando_jogadores"
  | "aguardando_jogadas"
  | "jokenpo"
  | "resultado"
  | "finalizado";

export interface EstadoSala {
  fase: Fase;

  jogadores: number;

  escolhas: Record<string, Escolha | null>;
  pontos: Record<string, number>;

  rodadas: number; // 🔥 NECESSÁRIO PRO PLACAR

  vencedorRodada?: string;
  vencedorFinal?: string;
}

/* ========================= */
/* HOOK */
/* ========================= */
export function useJogoOnline(roomId: string | null) {
  const [estado, setEstado] = useState<EstadoSala | null>(null);

  /* ========================= */
  /* RESET AO TROCAR / SAIR DA SALA */
  /* ========================= */
  useEffect(() => {
    setEstado(null);
  }, [roomId]);

  /* ========================= */
  /* LISTENER + SYNC INICIAL */
  /* ========================= */
  useEffect(() => {
    if (!roomId) return;

    function onState(novoEstado: EstadoSala) {
      setEstado(novoEstado);
    }

    socket.on("room:state", onState);

    // 🔥 IMPORTANTE: sync ao entrar / refresh
    socket.emit("room:get_state", { roomId });

    return () => {
      socket.off("room:state", onState);
    };
  }, [roomId]);

  /* ========================= */
  /* AÇÕES */
  /* ========================= */
  function escolher(escolha: Escolha) {
    if (!roomId) return;
    if (!estado) return;
    if (estado.fase !== "aguardando_jogadas") return;

    socket.emit("room:choice", {
      roomId,
      escolha,
    });
  }

  function reiniciar() {
    if (!roomId) return;

    socket.emit("room:restart", { roomId });
  }

  /* ========================= */
  /* API */
  /* ========================= */
  return {
    estado,
    fase: estado?.fase,
    escolher,
    reiniciar,
  };
}
