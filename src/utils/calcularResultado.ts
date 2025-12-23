import type { Escolha, Resultado } from "../types/jogo";

export function calcularResultado(
  jogador: Escolha,
  cpu: Escolha
): Resultado {
  if (jogador === cpu) return "empate";

  if (
    (jogador === "pedra" && cpu === "tesoura") ||
    (jogador === "papel" && cpu === "pedra") ||
    (jogador === "tesoura" && cpu === "papel")
  ) {
    return "vitoria";
  }

  return "derrota";
}
