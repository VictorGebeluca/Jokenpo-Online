import { useEffect, useRef, useState } from "react";

import Arena from "../components/Arena";
import Placar from "../components/Placar";
import BarraEscolhas from "../components/BarraEscolhas";
import Jokenpo from "../components/Jokenpo";
import TelaFinal from "../components/TelaFinal";
import Resultado from "../components/Resultado";
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
  /* ENTRADA AUTOMÁTICA NO JOGO ONLINE */
  /* ========================= */
  useEffect(() => {
    if (modo !== "online" || !roomId) return;

    function onState(state: { jogadores: number }) {
      if (state.jogadores === 2) {
        setTela("jogo");
        setModalOnlineAberto(false);
      }
    }

    socket.on("room:state", onState);
    return () => socket.off("room:state", onState);
  }, [modo, roomId]);

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
          totalRodadas: config.rodadas,
          resultadoRodada: jogoBot.resultadoRodada,
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
              totalRodadas: 3,
              resultadoRodada: undefined,
              finalizado: false,
              vencedor: undefined,
              jogar: () => {},
              reiniciar: () => {},
            };
          }

          const ids = Object.keys(estado.pontos);
          const oponenteId = ids.find(id => id !== meuId);

          let vencedorFinal: "jogador" | "bot" | undefined;
          if (estado.vencedorFinal) {
            vencedorFinal =
              estado.vencedorFinal === meuId ? "jogador" : "bot";
          }

          let resultadoRodada:
            | "jogador"
            | "bot"
            | "empate"
            | undefined;

          if (estado.vencedorRodada !== undefined) {
            if (estado.vencedorRodada === null) {
              resultadoRodada = "empate";
            } else {
              resultadoRodada =
                estado.vencedorRodada === meuId
                  ? "jogador"
                  : "bot";
            }
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
            totalRodadas: estado.rodadas,
            resultadoRodada,
            finalizado: estado.fase === "finalizado",
            vencedor: vencedorFinal,
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
    jogoUI.vencedor === "jogador"
      ? playFinalWin()
      : playFinalLose();
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
  /* RENDER */
  /* ========================= */
  return (
    <>
      {tela === "menu" && (
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
            }}
          />
        </>
      )}

      {tela === "jogo" && (
        <>
          {jogoUI.finalizado && jogoUI.vencedor ? (
            <TelaFinal
              vencedor={jogoUI.vencedor}
              onReiniciar={() => {
                jogoUI.reiniciar();
                somFinalTocado.current = false;
              }}
              onVoltarMenu={voltarMenu}
            />
          ) : (
            <div className="jogo-container">
              <TopBar
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onOpenSettings={() => setModalAberto(true)}
              />

              <Placar
                pontosJogador={jogoUI.pontosJogador}
                pontosBot={jogoUI.pontosOponente}
                total={jogoUI.totalRodadas}
                nomeOponente={modo === "online" ? "OPONENTE" : "BOT"}
              />

              <Arena
                escolhaJogador={jogoUI.escolhaJogador}
                escolhaOponente={jogoUI.escolhaOponente}
              />

              {jogoUI.resultadoRodada && (
                <Resultado
                  resultado={jogoUI.resultadoRodada}
                  jogador={jogoUI.escolhaJogador}
                  bot={jogoUI.escolhaOponente}
                />
              )}

              {/* BOT */}
              {modo === "bot" &&
                jogoUI.escolhaJogador === null &&
                !jogoUI.finalizado && (
                  <BarraEscolhas onEscolher={jogoUI.jogar} />
                )}

              {/* ONLINE */}
              {modo === "online" &&
                jogoUI.fase === "aguardando_jogadas" &&
                (jogoUI.escolhaJogador === null ? (
                  <BarraEscolhas onEscolher={jogoUI.jogar} />
                ) : (
                  <div className="aguardando-oponente">
                    Aguardando oponente escolher...
                  </div>
                ))}

              <Jokenpo visivel={jogoUI.fase === "jokenpo"} />
            </div>
          )}
        </>
      )}

      <Modal
        aberto={modalAberto}
        tipo={tela === "menu" ? "menu" : "jogo"}
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
        onChangeRodadas={v =>
          setConfig(c => ({ ...c, rodadas: v }))
        }
        onChangeDificuldade={v =>
          setConfig(c => ({ ...c, dificuldade: v }))
        }
        onSair={tela === "jogo" ? voltarMenu : undefined}
        onFechar={() => setModalAberto(false)}
      />
    </>
  );
}
