import { useEffect, useRef, useState } from "react";

import Arena from "../components/Arena";
import Placar from "../components/Placar";
import Resultado from "../components/Resultado";
import BarraEscolhas from "../components/BarraEscolhas";
import Jokenpo from "../components/Jokenpo";
import TelaFinal from "../components/TelaFinal";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import Modal from "../components/Modal";

import { useJogo } from "../hooks/useJogo";

import { useSound } from "../../public/sounds/useSound";

import "./Jogo.css";

/* ========================= */
/* TIPOS */
/* ========================= */
type Tela = "menu" | "jogo";

/* ========================= */
/* COMPONENTE */
/* ========================= */
export default function Jogo() {
  /* ========================= */
  /* TELAS / AUDIO */
  /* ========================= */
  const [tela, setTela] = useState<Tela>("menu");
  const [audioLiberado, setAudioLiberado] = useState(false);

  /* ========================= */
  /* CONFIG */
  /* ========================= */
  const [config, setConfig] = useState({
    musica: true,
    efeitos: true,
    rodadas: 3,
    dificuldade: "normal" as "facil" | "normal" | "dificil",
  });

  /* ========================= */
  /* UI */
  /* ========================= */
  const [modalAberto, setModalAberto] = useState(false);

  /* ========================= */
  /* SOM */
  /* ========================= */
  const {
    playButton,
    playDrums,
    playWinner,
    playLoser,
    playFinalWin,
    playFinalLose,
    toggleMute,
    unlockAudio,
    isMuted,
    setMusicEnabled,
    setEffectsEnabled,
  } = useSound();

  /* ========================= */
  /* JOGO (HOOK) */
  /* ========================= */
const jogo = useJogo({
  rodadas: config.rodadas,
  dificuldade: config.dificuldade,
  onPlayButton: playButton,
  onPlayDrums: playDrums,
  onPlayWinner: playWinner,
  onPlayLoser: playLoser,
});


  /* ========================= */
  /* SOM FINAL (1x) */
  /* ========================= */
  const somFinalTocado = useRef(false);

  useEffect(() => {
    if (!jogo.finalizado || somFinalTocado.current) return;

    somFinalTocado.current = true;
    jogo.vencedor === "jogador" ? playFinalWin() : playFinalLose();
  }, [jogo.finalizado, jogo.vencedor, playFinalWin, playFinalLose]);

  /* ========================= */
  /* MENU */
  /* ========================= */
  function ativarAudio() {
    setAudioLiberado(true);
    unlockAudio();
  }

  function iniciarJogoBot() {
    if (!audioLiberado) return;
    playButton();
    setTimeout(() => setTela("jogo"), 200);
  }

  function voltarMenu() {
    jogo.reiniciar();
    somFinalTocado.current = false;
    setTela("menu");
  }

  /* ========================= */
  /* TELAS */
  /* ========================= */
  if (tela === "menu") {
    return (
      <>
        <Menu
          onJogarBot={iniciarJogoBot}
          onAtivarAudio={ativarAudio}
          audioLiberado={audioLiberado}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenSettings={() => setModalAberto(true)}
        />

        <Modal
          aberto={modalAberto}
          tipo="menu"
          musica={config.musica}
          efeitos={config.efeitos}
          rodadas={config.rodadas}
          dificuldade={config.dificuldade}
          onToggleMusica={() =>
            setConfig((c) => {
              setMusicEnabled(!c.musica);
              return { ...c, musica: !c.musica };
            })
          }
          onToggleEfeitos={() =>
            setConfig((c) => {
              setEffectsEnabled(!c.efeitos);
              return { ...c, efeitos: !c.efeitos };
            })
          }
          onChangeRodadas={(rodadas) =>
            setConfig((c) => ({ ...c, rodadas }))
          }
          onChangeDificuldade={(dificuldade: "facil" | "normal" | "dificil") =>
  setConfig((c) => ({ ...c, dificuldade }))
}

          onFechar={() => setModalAberto(false)}
        />
      </>
    );
  }

  if (jogo.finalizado) {
    return (
      <TelaFinal
        vencedor={jogo.vencedor}
        onReiniciar={() => {
          jogo.reiniciar();
          somFinalTocado.current = false;
        }}
        onVoltarMenu={voltarMenu}
      />
    );
  }

  /* ========================= */
  /* JOGO */
  /* ========================= */
  return (
    <div className="jogo-container">
      <TopBar
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenSettings={() => setModalAberto(true)}
      />

      <Placar
        pontosJogador={jogo.pontosJogadorVisivel}
        pontosBot={jogo.pontosBotVisivel}
        total={config.rodadas}
      />

      {jogo.fase !== "jokenpo" && (
        <Arena
          escolhaJogador={jogo.escolhaJogador}
          escolhaOponente={jogo.escolhaBot}
        />
      )}

      {jogo.fase === "resultado" &&
        jogo.escolhaJogador &&
        jogo.escolhaBot && (
          <Resultado
            jogador={jogo.escolhaJogador}
            bot={jogo.escolhaBot}
          />
        )}

      {jogo.fase === "idle" && !jogo.escolhaJogador && (
        <BarraEscolhas onEscolher={jogo.jogar} />
      )}

      <Jokenpo visivel={jogo.fase === "jokenpo"} />

      <Modal
        aberto={modalAberto}
        tipo="jogo"
        musica={config.musica}
        efeitos={config.efeitos}
        onToggleMusica={() =>
          setConfig((c) => {
            setMusicEnabled(!c.musica);
            return { ...c, musica: !c.musica };
          })
        }
        onToggleEfeitos={() =>
          setConfig((c) => {
            setEffectsEnabled(!c.efeitos);
            return { ...c, efeitos: !c.efeitos };
          })
        }
        onSair={() => {
          voltarMenu();
          setModalAberto(false);
        }}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
