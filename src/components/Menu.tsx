import "./Menu.css";
import TopBar from "./TopBar";

interface Props {
  onJogarBot: () => void;
  onJogarOnline: () => void; // ✅ NOVO
  onAtivarAudio: () => void;
  audioLiberado: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
}

export default function Menu({
  onJogarBot,
  onJogarOnline,
  onAtivarAudio,
  audioLiberado,
  isMuted,
  onToggleMute,
  onOpenSettings,
}: Props) {
  return (
    <div className="menu">
      <TopBar
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenSettings={onOpenSettings}
      />

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

        <button
          className="menu-btn"
          onClick={onJogarOnline}
          disabled={!audioLiberado}
        >
          👥 Jogar com amigo
        </button>

        <button className="menu-btn disabled" disabled>
          🏆 Ranking
        </button>
      </div>
    </div>
  );
}
