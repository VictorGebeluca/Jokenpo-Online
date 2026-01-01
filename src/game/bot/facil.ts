import type { Escolha } from "../regras";

const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];

export function botFacil(): Escolha {
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}
