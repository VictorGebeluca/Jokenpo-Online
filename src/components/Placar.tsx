import "./Placar.css";

interface Props {
  pontosJogador: number;
  pontosBot: number;
}

export default function Placar({ pontosJogador, pontosBot }: Props) {
  return (
    <div className="placar">
      <div className="lado">
        <span className="nome">VOCÊ</span>
        <span className="pontos">{pontosJogador}</span>
      </div>
      <span className="vs">VS</span>
      <div className="lado">
        <span className="nome">BOT</span>
        <span className="pontos">{pontosBot}</span>
      </div>
    </div>
  );
}
