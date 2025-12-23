import "./Arena.css";
import type { Escolha } from "../types/jogo";

interface Props {
  escolhaJogador: Escolha | null;
  escolhaOponente: Escolha | null;
}

// converte escolha lógica → visual
function renderMao(escolha: Escolha | null) {
  if (!escolha) return "❔";

  if (escolha === "pedra") return "✊";
  if (escolha === "papel") return "✋";
  if (escolha === "tesoura") return "✌️";
}

export default function Arena({ escolhaJogador, escolhaOponente }: Props) {
  return (
    <div className="arena">
      <div className="maos">
        <div className="mao">{renderMao(escolhaJogador)}</div>
        <div className="mao">{renderMao(escolhaOponente)}</div>
      </div>
    </div>
  );
}
