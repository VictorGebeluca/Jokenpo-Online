import "./Arena.css";
import type { Escolha } from "../types/jogo";

interface Props {
  escolhaJogador: Escolha | null;
  escolhaOponente: Escolha | null;
}

function renderMao(escolha: Escolha | null) {
  if (!escolha) {
    return <span className="interrogacao">❔</span>;
  }

  return (
    <img
      src={`/${escolha}.png`}
      alt={escolha}
      className="mao-img"
    />
  );
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
