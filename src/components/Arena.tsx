import "./Arena.css";
import type { Escolha } from "../types/jogo";

interface Props {
  escolhaJogador: Escolha | null;
  escolhaOponente: Escolha | null;
}

function renderMao(escolha: Escolha | null, lado: "jogador" | "oponente") {
  if (!escolha) {
    return <span className="interrogacao">❔</span>;
  }

  return (
    <img
      src={`/${escolha}.png`}
      alt={escolha}
      className={`mao-img animacao-${lado}`}
    />
  );
}

export default function Arena({ escolhaJogador, escolhaOponente }: Props) {
  return (
    <div className="arena">
      <div className="arena-inner">
        <div className="mao">
          {renderMao(escolhaJogador, "jogador")}
        </div>

        <div className="vs">VS</div>

        <div className="mao">
          {renderMao(escolhaOponente, "oponente")}
        </div>
      </div>
    </div>
  );
}
