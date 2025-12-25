import { useState } from "react";
import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import Jokenpo from "../components/Jokenpo";
import TelaFinal from "../components/TelaFinal";
import type { Escolha } from "../types/jogo";
import "./Jogo.css";

type Vencedor = "jogador" | "bot";

export default function Jogo() {
  const [escolhaJogador, setEscolhaJogador] = useState<Escolha | null>(null);
  const [escolhaBot, setEscolhaBot] = useState<Escolha | null>(null);

  const [mostrarJokenpo, setMostrarJokenpo] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // pontos REAIS (lógica)
  const [pontosJogador, setPontosJogador] = useState(0);
  const [pontosBot, setPontosBot] = useState(0);

  // pontos VISUAIS (placar)
  const [pontosJogadorVisivel, setPontosJogadorVisivel] = useState(0);
  const [pontosBotVisivel, setPontosBotVisivel] = useState(0);

  const [finalizado, setFinalizado] = useState(false);
  const [vencedor, setVencedor] = useState<Vencedor>("jogador");

  function jogar(escolha: Escolha) {
    if (finalizado || mostrarJokenpo || mostrarResultado) return;

    const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];
    const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

    // reset visual
    setMostrarResultado(false);
    setEscolhaJogador(null);
    setEscolhaBot(null);

    // 1️⃣ Jokenpô
    setMostrarJokenpo(true);

    setTimeout(() => {
      // 2️⃣ Revela mãos
      setMostrarJokenpo(false);
      setEscolhaJogador(escolha);
      setEscolhaBot(bot);

      const jogadorVenceu =
        (escolha === "pedra" && bot === "tesoura") ||
        (escolha === "papel" && bot === "pedra") ||
        (escolha === "tesoura" && bot === "papel");

      const botVenceu =
        (bot === "pedra" && escolha === "tesoura") ||
        (bot === "papel" && escolha === "pedra") ||
        (bot === "tesoura" && escolha === "papel");

      // calcula pontos localmente (seguro)
      let novoPontosJogador = pontosJogador;
      let novoPontosBot = pontosBot;

      if (jogadorVenceu) novoPontosJogador++;
      if (botVenceu) novoPontosBot++;

      // aplica pontos REAIS
      setPontosJogador(novoPontosJogador);
      setPontosBot(novoPontosBot);

      // 3️⃣ Mostra resultado
      setTimeout(() => {
        setMostrarResultado(true);

        // 4️⃣ AGORA sim atualiza placar visual (não cagueta)
        setPontosJogadorVisivel(novoPontosJogador);
        setPontosBotVisivel(novoPontosBot);

        // 5️⃣ Verifica fim (primeiro a 3)
        if (novoPontosJogador === 3 || novoPontosBot === 3) {
          setVencedor(novoPontosJogador === 3 ? "jogador" : "bot");
          setTimeout(() => setFinalizado(true), 800);
          return;
        }

        // próxima rodada
        setTimeout(() => {
          setMostrarResultado(false);
          setEscolhaJogador(null);
          setEscolhaBot(null);
        }, 1800);
      }, 600);
    }, 1100);
  }

  function reiniciarJogo() {
    setFinalizado(false);
    setPontosJogador(0);
    setPontosBot(0);
    setPontosJogadorVisivel(0);
    setPontosBotVisivel(0);
    setEscolhaJogador(null);
    setEscolhaBot(null);
    setMostrarResultado(false);
    setMostrarJokenpo(false);
  }

  // 🔚 Tela final
  if (finalizado) {
    return (
      <TelaFinal
        vencedor={vencedor}
        onReiniciar={reiniciarJogo}
      />
    );
  }

  return (
    <div className="jogo-container">
      <Placar
        pontosJogador={pontosJogadorVisivel}
        pontosBot={pontosBotVisivel}
      />

      {!mostrarJokenpo && (
        <Arena
          escolhaJogador={escolhaJogador}
          escolhaOponente={escolhaBot}
        />
      )}

      {mostrarResultado && escolhaJogador && escolhaBot && (
        <Resultado jogador={escolhaJogador} bot={escolhaBot} />
      )}

      {!mostrarJokenpo && !mostrarResultado && !escolhaJogador && (
        <BarraEscolhas onEscolher={jogar} />
      )}

      <Jokenpo visivel={mostrarJokenpo} />
    </div>
  );
}
