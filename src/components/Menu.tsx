import { useState } from "react";
import "./Menu.css";
import TopBar from "./topBar";
import Modal from "./Modal";

interface Props {
  onJogarBot: () => void;
  onAtivarAudio: () => void;
  audioLiberado: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function Menu({
  onJogarBot,
  onAtivarAudio,
  audioLiberado,
  isMuted,
  onToggleMute,
}: Props) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="menu">
      {/* ⬆️ TOPBAR — SEM MUDAR LAYOUT */}
      <TopBar
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenSettings={() => setModalAberto(true)}
      />

      {/* OVERLAY DE ATIVAÇÃO DE ÁUDIO */}
      {!audioLiberado && (
        <div className="overlay-start" onClick={onAtivarAudio}>
          <div className="overlay-content">
            <h2>TOQUE PARA COMEÇAR</h2>
            <p>🔊 Ativar som</p>
          </div>
        </div>
      )}

      <h1 className="menu-titulo">JOKENPÔ</h1>

      <div className="menu-botoes">
        <button
          className="menu-btn"
          onClick={onJogarBot}
          disabled={!audioLiberado}
        >
          🤖 Jogar com Bot
        </button>

        <button className="menu-btn disabled" disabled>
          👥 Jogar com Amigo
        </button>

        <button className="menu-btn disabled" disabled>
          🏆 Ranking
        </button>
      </div>

      {/* 🔧 MODAL — OVERLAY PURO */}
      <Modal
        aberto={modalAberto}
        tipo="menu"
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
