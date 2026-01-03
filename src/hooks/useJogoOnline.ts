import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { Escolha, Dificuldade } from "../game/regras";

/* ========================= */
/* TIPOS */
/* ========================= */
export type Fase = "idle" | "jokenpo" | "resultado" | "finalizado";

export interface EstadoSala {
  fase: Fase;
  escolhas: Record<string, Escolha | null>;
  pontos: Record<string, number>;
  vencedorRodada?: string;
  vencedorFinal?: string;
}

interface UseJogoOnlineParams {
  roomId: string;
  rodadas: number;
  dificuldade: Dificuldade;
}

/* ========================= */
/* HOOK */
/* ========================= */
export function useJogoOnline({
  roomId,
  rodadas,
  dificuldade,
}: UseJogoOnlineParams) {
  const [estado, setEstado] = useState<EstadoSala | null>(null);
  const [fase, setFase] = useState<Fase>("idle");

  /* ========================= */
  /* SOCKET LIFECYCLE */
  /* ========================= */
  useEffect(() => {
    if (!roomId) return;

    // entra na sala
    socket.emit("room:join", {
      roomId,
      rodadas,
      dificuldade,
    });

    // recebe estado da sala
    function onState(novoEstado: EstadoSala) {
      setEstado(novoEstado);
      setFase(novoEstado.fase);
    }

    socket.on("room:state", onState);

    return () => {
      socket.off("room:state", onState);
    };
  }, [roomId, rodadas, dificuldade]);

  /* ========================= */
  /* AÇÕES */
  /* ========================= */
  function escolher(escolha: Escolha) {
    if (fase !== "idle") return;

    socket.emit("room:choice", {
      roomId,
      escolha,
    });
  }

  function reiniciar() {
    socket.emit("room:restart", { roomId });
    setEstado(null);
    setFase("idle");
  }

  /* ========================= */
  /* API */
  /* ========================= */
  return {
    fase,
    estado,
    escolher,
    reiniciar,
  };
}
