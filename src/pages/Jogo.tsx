import { useState } from "react";
import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import "./Jogo.css";

const OPCOES = ["✊", "✋", "✌️"];

function decidirVencedor(j: string, b: string) {
  if (j === b) return "empate";
  if (
    (j === "✊" && b === "✌️") ||
    (j === "✋" && b === "✊") ||
    (j === "✌️" && b === "✋")
  )
    return "jogador";
  return "bot";
}

export default function Jogo() {
  const [escolhaJogador, setEscolhaJogador] = useState<string | null>(null);
  const [escolhaOponente, setEscolhaOponente] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<"jogador" | "bot" | "empate" | null>(null);
  const [placarJogador, setPlacarJogador] = useState(0);
  const [placarBot, setPlacarBot] = useState(0);

  const [faseRodada, setFaseRodada] =
    useState<"escolher" | "jo" | "ken" | "po" | "mostrarResultado">("escolher");

  function jogar(escolha: string) {
    if (faseRodada !== "escolher") return;

    const bot = OPCOES[Math.floor(Math.random() * OPCOES.length)];
    setEscolhaJogador(escolha);
    setEscolhaOponente(bot);

    setFaseRodada("jo");

    setTimeout(() => setFaseRodada("ken"), 600);
    setTimeout(() => setFaseRodada("po"), 1200);
    setTimeout(() => {
      const r = decidirVencedor(escolha, bot);
      setResultado(r);
      if (r === "jogador") setPlacarJogador((p) => p + 1);
      if (r === "bot") setPlacarBot((p) => p + 1);

      setFaseRodada("mostrarResultado");
    }, 1800);
  }

  function proximaRodada() {
    setEscolhaJogador(null);
    setEscolhaOponente(null);
    setResultado(null);
    setFaseRodada("escolher");
  }

  return (
    <div className="jogo-container">
      <div className="placar-container">
        <Placar pontosJogador={placarJogador} pontosBot={placarBot} />
      </div>

      <div className="arena-wrapper">
        <Arena
          escolhaJogador={escolhaJogador}
          escolhaOponente={escolhaOponente}
          vencedor={faseRodada === "mostrarResultado" ? resultado : null}
          faseRodada={faseRodada}
        />

        {faseRodada === "mostrarResultado" && resultado && (
          <Resultado resultado={resultado} />
        )}

        {faseRodada === "mostrarResultado" && (
          <button className="btn-proxima" onClick={proximaRodada}>
            Próxima rodada
          </button>
        )}
      </div>

      <div className="barra-container">
        {faseRodada === "escolher" && (
          <BarraEscolhas onEscolher={jogar} bloqueado={faseRodada !== "escolher"} />
        )}
      </div>
    </div>
  );
}
