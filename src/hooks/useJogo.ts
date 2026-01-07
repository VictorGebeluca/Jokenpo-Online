import { useRef, useState } from "react";
import type { Escolha, Dificuldade } from "../game/regras";

import {
  decidirRodada,
  decidirVencedorFinal,
  jogoFinalizado,
  type VencedorFinal,
} from "../game/regras";

import {
  botFacil,
  botNormal,
  botDificil,
  resetarBotDificil,
} from "../game/bot";

/* ========================= */
/* TIPOS */
/* ========================= */
type Fase = "idle" | "jokenpo" | "resultado";

interface UseJogoParams {
  rodadas: number;
  dificuldade: Dificuldade;
  onPlayButton: () => void;
  onPlayDrums: () => void;
  onPlayWinner: () => void;
  onPlayLoser: () => void;
}

/* ========================= */
/* HOOK */
/* ========================= */
export function useJogo({
  rodadas,
  dificuldade,
  onPlayButton,
  onPlayDrums,
  onPlayWinner,
  onPlayLoser,
}: UseJogoParams) {
  /* ========================= */
  /* ESTADO */
  /* ========================= */
  const [fase, setFase] = useState<Fase>("idle");

  const [escolhaJogador, setEscolhaJogador] = useState<Escolha | null>(null);
  const [escolhaBot, setEscolhaBot] = useState<Escolha | null>(null);

  const [pontosJogador, setPontosJogador] = useState(0);
  const [pontosBot, setPontosBot] = useState(0);

  const [pontosJogadorVisivel, setPontosJogadorVisivel] = useState(0);
  const [pontosBotVisivel, setPontosBotVisivel] = useState(0);

  const [finalizado, setFinalizado] = useState(false);
  const [vencedor, setVencedor] = useState<VencedorFinal | null>(null);

  // ✅ NOVO — usado para confete / animação por rodada
  const [vencedorRodada, setVencedorRodada] = useState<
    "jogador" | "bot" | null
  >(null);

  /* ========================= */
  /* CONTROLE */
  /* ========================= */
  const bloqueado = fase !== "idle" || finalizado;
  const timeouts = useRef<number[]>([]);

  function limparTimeouts() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }

  /* ========================= */
  /* BOT */
  /* ========================= */
  function escolherBot(escolhaJogador: Escolha): Escolha {
    if (dificuldade === "facil") return botFacil();
    if (dificuldade === "normal") return botNormal();
    return botDificil(escolhaJogador);
  }

  /* ========================= */
  /* JOGAR */
  /* ========================= */
  function jogar(escolha: Escolha) {
    if (bloqueado) return;

    onPlayButton();
    setVencedorRodada(null);
    setFase("jokenpo");

    timeouts.current.push(
      window.setTimeout(() => {
        const bot = escolherBot(escolha);
        onPlayDrums();

        timeouts.current.push(
          window.setTimeout(() => {
            setEscolhaJogador(escolha);
            setEscolhaBot(bot);
            setFase("resultado");

            const resultado = decidirRodada(escolha, bot);

            let novoJogador = pontosJogador;
            let novoBot = pontosBot;

            if (resultado === "jogador") {
              novoJogador++;
              setVencedorRodada("jogador"); // ✅
              onPlayWinner();
            }

            if (resultado === "bot") {
              novoBot++;
              setVencedorRodada("bot"); // ✅
              onPlayLoser();
            }

            setPontosJogador(novoJogador);
            setPontosBot(novoBot);

            timeouts.current.push(
              window.setTimeout(() => {
                setPontosJogadorVisivel(novoJogador);
                setPontosBotVisivel(novoBot);

                if (jogoFinalizado(novoJogador, novoBot, rodadas)) {
                  const vencedorFinal: VencedorFinal =
                    decidirVencedorFinal(novoJogador, novoBot);

                  timeouts.current.push(
                    window.setTimeout(() => {
                      setVencedor(vencedorFinal);
                      setFinalizado(true);
                    }, 1200)
                  );
                  return;
                }

                timeouts.current.push(
                  window.setTimeout(() => {
                    setEscolhaJogador(null);
                    setEscolhaBot(null);
                    setVencedorRodada(null);
                    setFase("idle");
                  }, 2600)
                );
              }, 1200)
            );
          }, 2600)
        );
      }, 200)
    );
  }

  /* ========================= */
  /* RESET */
  /* ========================= */
  function reiniciar() {
    limparTimeouts();
    resetarBotDificil();

    setFase("idle");
    setFinalizado(false);
    setVencedor(null);
    setVencedorRodada(null);
    setEscolhaJogador(null);
    setEscolhaBot(null);
    setPontosJogador(0);
    setPontosBot(0);
    setPontosJogadorVisivel(0);
    setPontosBotVisivel(0);
  }

  /* ========================= */
  /* API */
  /* ========================= */
  return {
    fase,
    escolhaJogador,
    escolhaBot,
    pontosJogadorVisivel,
    pontosBotVisivel,
    finalizado,
    vencedor,
    vencedorRodada, // ✅ EXPOSIÇÃO CORRETA
    jogar,
    reiniciar,
  };
}
