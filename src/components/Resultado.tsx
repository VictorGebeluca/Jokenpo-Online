import "./Resultado.css";
import { useEffect, useState } from "react";

interface Props {
  jogador: "pedra" | "papel" | "tesoura";
  bot: "pedra" | "papel" | "tesoura";
}

interface Confete {
  id: number;
  style: React.CSSProperties;
}

export default function Resultado({ jogador, bot }: Props) {
  const [confetes, setConfetes] = useState<Confete[]>([]);

  let texto = "EMPATE!";
  let classe = "empate";

  if (
    (jogador === "pedra" && bot === "tesoura") ||
    (jogador === "papel" && bot === "pedra") ||
    (jogador === "tesoura" && bot === "papel")
  ) {
    texto = "VENCEU!";
    classe = "vitoria";
  } else if (jogador !== bot) {
    texto = "PERDEU!";
    classe = "derrota";
  }

  // cria confetes se vitória
  useEffect(() => {
    if (classe === "vitoria") {
      const novosConfetes: Confete[] = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
          animationDelay: `${Math.random() * 0.5}s`,
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
        },
      }));
      setConfetes(novosConfetes);

      const timer = setTimeout(() => setConfetes([]), 3000); // remove confetes após 3s
      return () => clearTimeout(timer);
    }
  }, [classe]);

  return (
    <div className="resultado-backdrop">
      <div className={`resultado-card ${classe}`}>
        {texto}
      </div>

      {confetes.map((c) => (
        <div key={c.id} className="confete" style={c.style}></div>
      ))}
    </div>
  );
}

