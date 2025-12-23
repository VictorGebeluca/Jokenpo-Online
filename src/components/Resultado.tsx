import "./Resultado.css";
import type { Escolha } from "../types/jogo";

interface Props {
  jogador: Escolha | null;
  bot: Escolha | null;
}

export default function Resultado({ jogador, bot }: Props) {
  if (!jogador || !bot) return null;

  let texto = "Empate!";
  let classe = "empate";

  if (
    (jogador === "pedra" && bot === "tesoura") ||
    (jogador === "papel" && bot === "pedra") ||
    (jogador === "tesoura" && bot === "papel")
  ) {
    texto = "Você venceu!";
    classe = "vitoria";
  } else if (jogador !== bot) {
    texto = "Você perdeu!";
    classe = "derrota";
  }

  return <div className={`resultado ${classe}`}>{texto}</div>;
}
