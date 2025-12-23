import { useState } from "react";
import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import Jokenpo from "../components/Jokenpo";
import type { Escolha } from "../types/jogo";
import "./Jogo.css";

export default function Jogo() {
  const [escolhaJogador, setEscolhaJogador] = useState<Escolha | null>(null);
  const [escolhaBot, setEscolhaBot] = useState<Escolha | null>(null);

  const [mostrarJokenpo, setMostrarJokenpo] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const [pontosJogador, setPontosJogador] = useState(0);
  const [pontosBot, setPontosBot] = useState(0);

  function jogar(escolha: Escolha) {
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

      if (
        (escolha === "pedra" && bot === "tesoura") ||
        (escolha === "papel" && bot === "pedra") ||
        (escolha === "tesoura" && bot === "papel")
      ) {
        setPontosJogador((p) => p + 1);
      } else if (escolha !== bot) {
        setPontosBot((p) => p + 1);
      }

      // 3️⃣ Resultado aparece DEPOIS das mãos
      setTimeout(() => {
        setMostrarResultado(true);
      }, 600);

      // 4️⃣ Próxima rodada automática
      setTimeout(() => {
        setMostrarResultado(false);
        setEscolhaJogador(null);
        setEscolhaBot(null);
      }, 2600);
    }, 1100);
  }

  return (
    <div className="jogo-container">
      <Placar pontosJogador={pontosJogador} pontosBot={pontosBot} />

      {!mostrarJokenpo && (
        <Arena
          escolhaJogador={escolhaJogador}
          escolhaOponente={escolhaBot}
        />
      )}

      {/* RESULTADO COMO OVERLAY */}
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
