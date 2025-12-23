import { useState } from "react";
import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import type { Escolha } from "../types/jogo";
import "./Jogo.css";

export default function Jogo() {
  const [escolhaJogador, setEscolhaJogador] = useState<Escolha | null>(null);
  const [escolhaBot, setEscolhaBot] = useState<Escolha | null>(null);

  const [pontosJogador, setPontosJogador] = useState(0);
  const [pontosBot, setPontosBot] = useState(0);

  function jogar(escolha: Escolha) {
    const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];
    const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

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
  }

  return (
    <div className="jogo-container">
      <Placar pontosJogador={pontosJogador} pontosBot={pontosBot} />
      <Arena escolhaJogador={escolhaJogador} escolhaOponente={escolhaBot} />
      <Resultado jogador={escolhaJogador} bot={escolhaBot} />
      <BarraEscolhas onEscolher={jogar} />
    </div>
  );
}
