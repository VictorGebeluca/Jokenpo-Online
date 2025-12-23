import type { Escolha } from "../types/jogo";

const escolhas: Escolha[] = ["pedra", "papel", "tesoura"];

export function escolhaCpu(): Escolha {
  const index = Math.floor(Math.random() * escolhas.length);
  return escolhas[index];
}
