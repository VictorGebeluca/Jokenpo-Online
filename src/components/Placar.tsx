import "./Placar.css";

interface Props {
  pontosJogador: number;
  pontosBot: number;
}

export default function Placar({ pontosJogador, pontosBot }: Props) {
  const total = 3;

  return (
    <div className="placar">
      <div className="lado jogador">
        <span className="nome">VOCÊ</span>
        <div className="bolinhas">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`bolinha ${i < pontosJogador ? "ativa" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="lado bot">
        <span className="nome">BOT</span>
        <div className="bolinhas">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`bolinha ${i < pontosBot ? "ativa" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
