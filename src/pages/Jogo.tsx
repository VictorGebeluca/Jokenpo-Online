import { useState } from "react";

import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import Jokenpo from "../components/Jokenpo";
import TelaFinal from "../components/TelaFinal";
import Menu from "../components/Menu";

import type { Escolha } from "../types/jogo";
import { useSound } from "../../public/sounds/useSound";

import "./Jogo.css";

type Vencedor = "jogador" | "bot";
type Tela = "menu" | "jogo";

export default function Jogo() {
  /* ===================== */
  /* TELAS */
  /* ===================== */
  const [tela, setTela] = useState<Tela>("menu");
  const [audioLiberado, setAudioLiberado] = useState(false);

  /* ===================== */
  /* JOGO */
  /* ===================== */
  const [escolhaJogador, setEscolhaJogador] = useState<Escolha | null>(null);
  const [escolhaBot, setEscolhaBot] = useState<Escolha | null>(null);

  const [mostrarJokenpo, setMostrarJokenpo] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const [pontosJogador, setPontosJogador] = useState(0);
  const [pontosBot, setPontosBot] = useState(0);

  const [pontosJogadorVisivel, setPontosJogadorVisivel] = useState(0);
  const [pontosBotVisivel, setPontosBotVisivel] = useState(0);

  const [finalizado, setFinalizado] = useState(false);
  const [vencedor, setVencedor] = useState<Vencedor>("jogador");

  /* ===================== */
  /* SOM */
  /* ===================== */
  const { playButton, startMusic } = useSound();

  /* ===================== */
  /* AUDIO GATE */
  /* ===================== */
  function ativarAudio() {
    startMusic(); // 🎵 música começa no primeiro clique
    setAudioLiberado(true);
  }

  /* ===================== */
  /* MENU -> JOGO */
  /* ===================== */
  function iniciarJogoBot() {
    if (!audioLiberado) return;

    playButton();
    setTela("jogo");
  }

  /* ===================== */
  /* LÓGICA DO JOGO */
  /* ===================== */
  function jogar(escolha: Escolha) {
    if (finalizado || mostrarJokenpo || mostrarResultado) return;

    playButton();

    const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];
    const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

    setMostrarResultado(false);
    setEscolhaJogador(null);
    setEscolhaBot(null);

    /* 1️⃣ JOKENPÔ */
    setMostrarJokenpo(true);

    setTimeout(() => {
      /* 2️⃣ MOSTRA AS MÃOS */
      setMostrarJokenpo(false);
      setEscolhaJogador(escolha);
      setEscolhaBot(bot);

      const jogadorVenceu =
        (escolha === "pedra" && bot === "tesoura") ||
        (escolha === "papel" && bot === "pedra") ||
        (escolha === "tesoura" && bot === "papel");

      const botVenceu =
        (bot === "pedra" && escolha === "tesoura") ||
        (bot === "papel" && escolha === "pedra") ||
        (bot === "tesoura" && escolha === "papel");

      let novoJogador = pontosJogador;
      let novoBot = pontosBot;

      if (jogadorVenceu) novoJogador++;
      if (botVenceu) novoBot++;

      setPontosJogador(novoJogador);
      setPontosBot(novoBot);

      /* 3️⃣ RESULTADO */
      setTimeout(() => {
        setMostrarResultado(true);
        setPontosJogadorVisivel(novoJogador);
        setPontosBotVisivel(novoBot);

        /* 4️⃣ FIM DE JOGO */
        if (novoJogador === 3 || novoBot === 3) {
          setVencedor(novoJogador === 3 ? "jogador" : "bot");
          setTimeout(() => setFinalizado(true), 1200);
          return;
        }

        /* 5️⃣ LIMPA PARA PRÓXIMA RODADA */
        setTimeout(() => {
          setMostrarResultado(false);
          setEscolhaJogador(null);
          setEscolhaBot(null);
        }, 2600);
      }, 1200);
    }, 2600);
  }

  /* ===================== */
  /* REINICIAR */
  /* ===================== */
  function reiniciarJogo() {
    setFinalizado(false);
    setPontosJogador(0);
    setPontosBot(0);
    setPontosJogadorVisivel(0);
    setPontosBotVisivel(0);
    setEscolhaJogador(null);
    setEscolhaBot(null);
    setMostrarResultado(false);
    setMostrarJokenpo(false);
  }

  /* ===================== */
  /* TELAS */
  /* ===================== */
  if (tela === "menu") {
    return (
      <Menu
        onJogarBot={iniciarJogoBot}
        onAtivarAudio={ativarAudio}
        audioLiberado={audioLiberado}
      />
    );
  }

  if (finalizado) {
    return <TelaFinal vencedor={vencedor} onReiniciar={reiniciarJogo} />;
  }

  /* ===================== */
  /* JOGO */
  /* ===================== */
  return (
    <div className="jogo-container">
      <Placar
        pontosJogador={pontosJogadorVisivel}
        pontosBot={pontosBotVisivel}
      />

      {!mostrarJokenpo && (
        <Arena
          escolhaJogador={escolhaJogador}
          escolhaOponente={escolhaBot}
        />
      )}

      {mostrarResultado && escolhaJogador && escolhaBot && (
        <Resultado jogador={escolhaJogador} bot={escolhaBot} />
      )}

      {!mostrarJokenpo && !mostrarResultado && !escolhaJogador && (
        <BarraEscolhas onEscolher={jogar} />
      )}

      <Jokenpo visivel={mostrarJokenpo} />
    </div>
  );
}
