import { useEffect, useRef, useState } from "react";

import Arena from "../components/Arena";
import Placar from "../components/Placar";
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
import { socket } from "../socket";

import "./Jogo.css";

type Tela = "menu" | "jogo";
type ModoJogo = "bot" | "online";

export default function Jogo() {
  const [tela, setTela] = useState<Tela>("menu");
  const [modo, setModo] = useState<ModoJogo>("bot");
  const [roomId, setRoomId] = useState<string | null>(null);

  const [audioLiberado, setAudioLiberado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalOnlineAberto, setModalOnlineAberto] = useState(false);

  const [config, setConfig] = useState({
    musica: true,
    efeitos: true,
    rodadas: 3,
    dificuldade: "normal" as "facil" | "normal" | "dificil",
  });

  const {
    playButton,
    playFinalWin,
    playFinalLose,
    toggleMute,
    unlockAudio,
    isMuted,
    setMusicEnabled,
    setEffectsEnabled,
  } = useSound();

  /* ========================= */
  /* BOT */
  /* ========================= */
  const jogoBot = useJogo({
    rodadas: config.rodadas,
    dificuldade: config.dificuldade,
    onPlayButton: playButton,
    onPlayDrums: () => {},
    onPlayWinner: () => {},
    onPlayLoser: () => {},
  });

  /* ========================= */
  /* ONLINE */
  /* ========================= */
  const jogoOnline = useJogoOnline(
    modo === "online" ? roomId : null
  );

  /* ========================= */
  /* TROCA DE TELA ONLINE */
  /* ========================= */
  useEffect(() => {
    if (modo === "online") {
      setTela("jogo");
    }
  }, [modo]);

  /* ========================= */
  /* SOCKET ID */
  /* ========================= */
  const meuId = socket.id;

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
          const estado = jogoOnline.estado;

          if (!estado || !meuId) {
            return {
              fase: "aguardando_jogadores",
              escolhaJogador: null,
              escolhaOponente: null,
              pontosJogador: 0,
              pontosOponente: 0,
              finalizado: false,
              vencedor: undefined,
              jogar: () => {},
              reiniciar: () => {},
            };
          }

          const ids = Object.keys(estado.pontos);
          const oponenteId = ids.find(id => id !== meuId);

          let vencedor: "jogador" | "bot" | undefined;

          if (estado.vencedorFinal) {
            vencedor =
              estado.vencedorFinal === meuId
                ? "jogador"
                : "bot";
          }

          return {
            fase: estado.fase,
            escolhaJogador: estado.escolhas[meuId] ?? null,
            escolhaOponente: oponenteId
              ? estado.escolhas[oponenteId] ?? null
              : null,
            pontosJogador: estado.pontos[meuId] ?? 0,
            pontosOponente: oponenteId
              ? estado.pontos[oponenteId] ?? 0
              : 0,
            finalizado: estado.fase === "finalizado",
            vencedor,
            jogar: jogoOnline.escolher,
            reiniciar: jogoOnline.reiniciar,
          };
        })();

  /* ========================= */
  /* SOM FINAL */
  /* ========================= */
  const somFinalTocado = useRef(false);

  useEffect(() => {
    if (!jogoUI.finalizado || somFinalTocado.current) return;
    if (!jogoUI.vencedor) return;

    somFinalTocado.current = true;

    if (jogoUI.vencedor === "jogador") playFinalWin();
    if (jogoUI.vencedor === "bot") playFinalLose();
  }, [jogoUI.finalizado, jogoUI.vencedor]);

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
    setTela("jogo");
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

        <OnlineModal
          aberto={modalOnlineAberto}
          onFechar={() => setModalOnlineAberto(false)}
          onSalaPronta={id => {
            setModo("online");
            setRoomId(id);
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

      <Arena
        escolhaJogador={jogoUI.escolhaJogador}
        escolhaOponente={jogoUI.escolhaOponente}
      />

      {jogoUI.fase === "aguardando_jogadas" &&
        jogoUI.escolhaJogador === null && (
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
        onSair={voltarMenu}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
