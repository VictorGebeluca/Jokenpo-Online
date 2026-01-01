import type { Escolha } from "../regras";

const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];

let ultimaEscolha: Escolha | null = null;

export function botNormal(): Escolha {
  let escolha = opcoes[Math.floor(Math.random() * opcoes.length)];

  while (escolha === ultimaEscolha) {
    escolha = opcoes[Math.floor(Math.random() * opcoes.length)];
  }

  ultimaEscolha = escolha;
  return escolha;
}
