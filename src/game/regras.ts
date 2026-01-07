/* ========================= */
/* TIPOS */
/* ========================= */
export type Escolha = "pedra" | "papel" | "tesoura";
export type Dificuldade = "facil" | "normal" | "dificil";
export type ResultadoRodada = "jogador" | "bot" | "empate";
export type VencedorFinal = "jogador" | "bot";

/* ========================= */
/* REGRAS */
/* ========================= */

/**
 * Decide o resultado de uma rodada
 */
export function decidirRodada(
  jogador: Escolha,
  bot: Escolha
): ResultadoRodada {
  if (jogador === bot) return "empate";

  const jogadorVence =
    (jogador === "pedra" && bot === "tesoura") ||
    (jogador === "papel" && bot === "pedra") ||
    (jogador === "tesoura" && bot === "papel");

  return jogadorVence ? "jogador" : "bot";
}

/**
 * Verifica se o jogo terminou
 * (alguém atingiu o número de rodadas)
 */
export function jogoFinalizado(
  pontosJogador: number,
  pontosBot: number,
  totalRodadas: number
): boolean {
  return pontosJogador === totalRodadas || pontosBot === totalRodadas;
}

/**
 * Decide o vencedor final
 * (chamar somente se o jogo estiver finalizado)
 */
export function decidirVencedorFinal(
  pontosJogador: number,
  pontosBot: number
): VencedorFinal {
  return pontosJogador > pontosBot ? "jogador" : "bot";
}
