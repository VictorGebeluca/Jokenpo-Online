import "./Resultado.css";

interface Props {
  resultado: "jogador" | "bot" | "empate";
}

export default function Resultado({ resultado }: Props) {
  let texto = "Empate!";
  let classe = "empate";

  if (resultado === "jogador") {
    texto = "Você venceu!";
    classe = "vitoria";
  }
  if (resultado === "bot") {
    texto = "Você perdeu!";
    classe = "derrota";
  }

  return <div className={`resultado ${classe}`}>{texto}</div>;
}
