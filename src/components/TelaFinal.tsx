import { useEffect, useState } from "react";
import "./TelaFinal.css";

interface Confete {
  id: number;
  style: React.CSSProperties;
}

interface Props {
  vencedor: "jogador" | "bot";
  onReiniciar: () => void;
}

export default function TelaFinal({ vencedor, onReiniciar }: Props) {
  const [confetes, setConfetes] = useState<Confete[]>([]);

  useEffect(() => {
    if (vencedor !== "jogador") return;

    let id = 0;

    const gerarConfetes = () => {
      const novosConfetes: Confete[] = Array.from({ length: 30 }).map((_, i) => ({
        id: id + i,
        style: {
          left: `${Math.random() * 100}%`,
          backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
          animationDelay: `${Math.random() * 0.5}s`,
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
        },
      }));

      id += novosConfetes.length;
      setConfetes(novosConfetes);
    };

    gerarConfetes();
    const intervalo = setInterval(gerarConfetes, 4000);

    return () => clearInterval(intervalo);
  }, [vencedor]);

  return (
    <div className="tela-final">
      {vencedor === "jogador" &&
        confetes.map((c) => (
          <div key={c.id} className="confete" style={c.style} />
        ))}

      <div className="conteudo-central">
        <img
          src={vencedor === "jogador" ? "/trofeu.png" : "/derrota.png"}
          className="trofeu animar-entrada"
          alt="Resultado"
        />

        <h1 className="winner-text animar-texto">
          {vencedor === "jogador" ? "Você venceu!!" : "Game over!!"}
        </h1>
      </div>

      <button className="btn-reiniciar" onClick={onReiniciar}>
        Jogar novamente
      </button>
    </div>
  );
}
