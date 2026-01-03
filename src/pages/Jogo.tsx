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
import OnlineModal from "../components/OnlineModal";

import { useJogo } from "../hooks/useJogo";
import { useJogoOnline } from "../hooks/useJogoOnline";

import { useSound } from "../../public/sounds/useSound";

import "./Jogo.css";

/* ========================= */
/* TIPOS */
/* ========================= */
type Tela = "menu" | "jogo";
type ModoJogo = "bot" | "online";

/* ========================= */
/* COMPONENTE */
/* ========================= */
export default function Jogo() {
  /* ========================= */
  /* TELAS / MODO */
  /* ========================= */
  const [tela, setTela] = useState<Tela>("menu");
  const [modo, setModo] = useState<ModoJogo>("bot");
  const [roomId, setRoomId] = useState<string | null>(null);

  /* ========================= */
  /* AUDIO / UI */
  /* ========================= */
  const [audioLiberado, setAudioLiberado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalOnlineAberto, setModalOnlineAberto] = useState(false);

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
  /* JOGOS */
  /* ========================= */
  const jogoBot = useJogo({
    rodadas: config.rodadas,
    dificuldade: config.dificuldade,
    onPlayButton: playButton,
    onPlayDrums: playDrums,
    onPlayWinner: playWinner,
    onPlayLoser: playLoser,
  });

  const jogoOnline =
    modo === "online" && roomId
      ? useJogoOnline({
          roomId,
          rodadas: config.rodadas,
          dificuldade: config.dificuldade,
        })
      : null;

  /* ========================= */
  /* ADAPTER UI */
  /* ========================= */
  const jogoUI =
    modo === "bot"
      ? {
          fase: jogoBot.fase,
          escolhaJogador: jogoBot.escolhaJogador,
          escolhaOponente: jogoBot.escolhaBot,
          pontosJogador: jogoBot.pontosJogadorVisivel,
          pontosOponente: jogoBot.pontosBotVisivel,
          finalizado: jogoBot.finalizado,
          vencedor: jogoBot.vencedor,
          jogar: jogoBot.jogar,
          reiniciar: jogoBot.reiniciar,
        }
      : (() => {
          const estado = jogoOnline?.estado;

          const jogadores = estado ? Object.keys(estado.pontos) : [];
          const jogadorLocalId = jogadores[0];
          const oponenteId = jogadores[1];

          let vencedor: "jogador" | "bot" | undefined = undefined;

          if (estado?.vencedorFinal && jogadorLocalId) {
            vencedor =
              estado.vencedorFinal === jogadorLocalId
                ? "jogador"
                : "bot";
          }

          return {
            fase: jogoOnline?.fase ?? "idle",
            escolhaJogador: null,
            escolhaOponente: null,
            pontosJogador: estado?.pontos[jogadorLocalId] ?? 0,
            pontosOponente: estado?.pontos[oponenteId] ?? 0,
            finalizado: jogoOnline?.fase === "finalizado",
            vencedor,
            jogar: jogoOnline ? jogoOnline.escolher : () => {},
            reiniciar: jogoOnline ? jogoOnline.reiniciar : () => {},
          };
        })();

  /* ========================= */
  /* SOM FINAL */
  /* ========================= */
  const somFinalTocado = useRef(false);

  useEffect(() => {
    if (!jogoUI.finalizado || somFinalTocado.current || !jogoUI.vencedor)
      return;

    somFinalTocado.current = true;

    if (jogoUI.vencedor === "jogador") playFinalWin();
    if (jogoUI.vencedor === "bot") playFinalLose();
  }, [jogoUI.finalizado, jogoUI.vencedor, playFinalWin, playFinalLose]);

  /* ========================= */
  /* MENU */
  /* ========================= */
  function ativarAudio() {
    setAudioLiberado(true);
    unlockAudio();
  }

  function iniciarBot() {
    if (!audioLiberado) return;
    setModo("bot");
    playButton();
    setTimeout(() => setTela("jogo"), 200);
  }

  function iniciarOnline() {
    if (!audioLiberado) return;
    playButton();
    setModalOnlineAberto(true);
  }

  function voltarMenu() {
    jogoBot.reiniciar();
    setRoomId(null);
    setModo("bot");
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
          onJogarBot={iniciarBot}
          onJogarOnline={iniciarOnline}
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
            setConfig(c => {
              setMusicEnabled(!c.musica);
              return { ...c, musica: !c.musica };
            })
          }
          onToggleEfeitos={() =>
            setConfig(c => {
              setEffectsEnabled(!c.efeitos);
              return { ...c, efeitos: !c.efeitos };
            })
          }
          onChangeRodadas={rodadas =>
            setConfig(c => ({ ...c, rodadas }))
          }
          onChangeDificuldade={dificuldade =>
            setConfig(c => ({ ...c, dificuldade }))
          }
          onFechar={() => setModalAberto(false)}
        />

        <OnlineModal
          aberto={modalOnlineAberto}
          onFechar={() => setModalOnlineAberto(false)}
          onSalaPronta={id => {
            setModo("online");
            setRoomId(id);
            setTela("jogo");
            setModalOnlineAberto(false);
          }}
        />
      </>
    );
  }

  if (jogoUI.finalizado && jogoUI.vencedor) {
    return (
      <TelaFinal
        vencedor={jogoUI.vencedor}
        onReiniciar={() => {
          jogoUI.reiniciar();
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
        pontosJogador={jogoUI.pontosJogador}
        pontosBot={jogoUI.pontosOponente}
        total={config.rodadas}
      />

      {jogoUI.fase !== "jokenpo" && (
        <Arena
          escolhaJogador={jogoUI.escolhaJogador}
          escolhaOponente={jogoUI.escolhaOponente}
        />
      )}

      {jogoUI.fase === "resultado" &&
        jogoUI.escolhaJogador &&
        jogoUI.escolhaOponente && (
          <Resultado
            jogador={jogoUI.escolhaJogador}
            bot={jogoUI.escolhaOponente}
          />
        )}

      {jogoUI.fase === "idle" && (
        <BarraEscolhas onEscolher={jogoUI.jogar} />
      )}

      <Jokenpo visivel={jogoUI.fase === "jokenpo"} />

      <Modal
        aberto={modalAberto}
        tipo="jogo"
        musica={config.musica}
        efeitos={config.efeitos}
        onToggleMusica={() =>
          setConfig(c => {
            setMusicEnabled(!c.musica);
            return { ...c, musica: !c.musica };
          })
        }
        onToggleEfeitos={() =>
          setConfig(c => {
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
