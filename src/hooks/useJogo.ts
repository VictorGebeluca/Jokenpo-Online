import { useRef, useState } from "react";
import type { Escolha } from "../types/jogo";
import {
  decidirRodada,
  decidirVencedorFinal,
  jogoFinalizado,
  type VencedorFinal,
} from "../game/regras";

type Fase = "idle" | "jokenpo" | "resultado";

interface UseJogoParams {
  rodadas: number;
  onPlayButton: () => void;
  onPlayDrums: () => void;
  onPlayWinner: () => void;
  onPlayLoser: () => void;
}

export function useJogo({
  rodadas,
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
  const [vencedor, setVencedor] = useState<VencedorFinal>("jogador");

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
  /* JOGAR */
  /* ========================= */
  function jogar(escolha: Escolha) {
    if (bloqueado) return;

    onPlayButton();
    setFase("jokenpo");

    timeouts.current.push(
      window.setTimeout(() => {
        const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];
        const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

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
              onPlayWinner();
            }

            if (resultado === "bot") {
              novoBot++;
              onPlayLoser();
            }

            setPontosJogador(novoJogador);
            setPontosBot(novoBot);

            timeouts.current.push(
              window.setTimeout(() => {
                setPontosJogadorVisivel(novoJogador);
                setPontosBotVisivel(novoBot);

                if (jogoFinalizado(novoJogador, novoBot, rodadas)) {
                  setVencedor(
                    decidirVencedorFinal(novoJogador, novoBot, rodadas)
                  );
                  timeouts.current.push(
                    window.setTimeout(() => setFinalizado(true), 1200)
                  );
                  return;
                }

                timeouts.current.push(
                  window.setTimeout(() => {
                    setEscolhaJogador(null);
                    setEscolhaBot(null);
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
    setFase("idle");
    setFinalizado(false);
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
    jogar,
    reiniciar,
  };
}
