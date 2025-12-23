import "./Resultado.css";

interface Props {
  resultado: "jogador" | "bot" | "empate" | null;
}

export default function Resultado({ resultado }: Props) {
  if (!resultado) return null;

  let texto = "Empate!";
  let classe = "empate";

  if (resultado === "jogador") {
    texto = "Você venceu!";
    classe = "vitoria";
  } else if (resultado === "bot") {
    texto = "Você perdeu!";
    classe = "derrota";
  }

  return <div className={`resultado ${classe}`}>{texto}</div>;
}
