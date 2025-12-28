import { useState } from "react";

import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import Jokenpo from "../components/Jokenpo";
import TelaFinal from "../components/TelaFinal";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import Modal from "../components/Modal";

import type { Escolha } from "../types/jogo";
import { useSound } from "../../public/sounds/useSound";

import "./Jogo.css";

type Vencedor = "jogador" | "bot";
type Tela = "menu" | "jogo";

export default function Jogo() {
  const [tela, setTela] = useState<Tela>("menu");
  const [audioLiberado, setAudioLiberado] = useState(false);

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

  /* ===== MODAL ===== */
  const [modalAberto, setModalAberto] = useState(false);

  /* ===== CONFIG (placeholder por enquanto) ===== */
  const [musica, setMusica] = useState(true);
  const [efeitos, setEfeitos] = useState(true);
  const [rodadas, setRodadas] = useState(3);
  const [dificuldade, setDificuldade] =
    useState<"facil" | "normal" | "dificil">("normal");

  const {
    playButton,
    playDrums,
    playWinner,
    playLoser,
    startMusic,
    toggleMute,
    isMuted,
  } = useSound();

  function ativarAudio() {
    startMusic();
    setAudioLiberado(true);
  }

  function iniciarJogoBot() {
    if (!audioLiberado) return;
    playButton();
    setTimeout(() => setTela("jogo"), 200);
  }

  function jogar(escolha: Escolha) {
    if (finalizado || mostrarJokenpo || mostrarResultado) return;

    playButton();

    setTimeout(() => {
      const opcoes: Escolha[] = ["pedra", "papel", "tesoura"];
      const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

      setMostrarResultado(false);
      setEscolhaJogador(null);
      setEscolhaBot(null);

      setMostrarJokenpo(true);
      playDrums();

      setTimeout(() => {
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

        if (jogadorVenceu) {
          novoJogador++;
          playWinner();
        } else if (botVenceu) {
          novoBot++;
          playLoser();
        }

        setPontosJogador(novoJogador);
        setPontosBot(novoBot);

        setTimeout(() => {
          setMostrarResultado(true);
          setPontosJogadorVisivel(novoJogador);
          setPontosBotVisivel(novoBot);

          if (novoJogador === 3 || novoBot === 3) {
            setVencedor(novoJogador === 3 ? "jogador" : "bot");
            setTimeout(() => setFinalizado(true), 1200);
            return;
          }

          setTimeout(() => {
            setMostrarResultado(false);
            setEscolhaJogador(null);
            setEscolhaBot(null);
          }, 2600);
        }, 1200);
      }, 2600);
    }, 200);
  }

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

  /* ===== MENU ===== */
  if (tela === "menu") {
    return (
      <>
        <Menu
          onJogarBot={iniciarJogoBot}
          onAtivarAudio={ativarAudio}
          audioLiberado={audioLiberado}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <Modal
          aberto={modalAberto}
          tipo="menu"
          musica={musica}
          efeitos={efeitos}
          rodadas={rodadas}
          dificuldade={dificuldade}
          onToggleMusica={() => setMusica((v) => !v)}
          onToggleEfeitos={() => setEfeitos((v) => !v)}
          onChangeRodadas={setRodadas}
          onChangeDificuldade={setDificuldade}
          onFechar={() => setModalAberto(false)}
        />
      </>
    );
  }

  if (finalizado) {
    return <TelaFinal vencedor={vencedor} onReiniciar={reiniciarJogo} />;
  }

  /* ===== JOGO ===== */
  return (
    <div className="jogo-container">
      <TopBar
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenSettings={() => setModalAberto(true)}
      />

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

      <Modal
        aberto={modalAberto}
        tipo="jogo"
        musica={musica}
        efeitos={efeitos}
        rodadas={rodadas}
        dificuldade={dificuldade}
        onToggleMusica={() => setMusica((v) => !v)}
        onToggleEfeitos={() => setEfeitos((v) => !v)}
        onChangeRodadas={setRodadas}
        onChangeDificuldade={setDificuldade}
        onSairJogo={() => {
          setModalAberto(false);
          setTela("menu");
        }}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
