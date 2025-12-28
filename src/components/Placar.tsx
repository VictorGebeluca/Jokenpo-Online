import "./Placar.css";

interface Props {
  pontosJogador: number;
  pontosBot: number;
  total?: number;
}

export default function Placar({
  pontosJogador,
  pontosBot,
  total = 3, // 🔥 fallback de segurança
}: Props) {
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
