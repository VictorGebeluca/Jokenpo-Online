import type { Escolha } from "../regras";

/* ========================= */
/* MEMÓRIA DO BOT */
/* ========================= */
let historico: Escolha[] = [];

/* ========================= */
/* UTIL */
/* ========================= */
function contraJogada(escolha: Escolha): Escolha {
  if (escolha === "pedra") return "papel";
  if (escolha === "papel") return "tesoura";
  return "pedra";
}

/* ========================= */
/* BOT DIFÍCIL */
/* ========================= */
export function botDificil(escolhaJogador: Escolha): Escolha {
  historico.push(escolhaJogador);

  const contagem = historico.reduce(
    (acc, e) => {
      acc[e]++;
      return acc;
    },
    { pedra: 0, papel: 0, tesoura: 0 }
  );

  const maisUsada = Object.entries(contagem).sort(
    (a, b) => b[1] - a[1]
  )[0][0] as Escolha;

  return contraJogada(maisUsada);
}

/* ========================= */
/* RESET DE MEMÓRIA */
/* ========================= */
export function resetarBotDificil() {
  historico = [];
}
