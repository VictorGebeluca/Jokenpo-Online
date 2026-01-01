import "./Menu.css";
import TopBar from "./TopBar";

interface Props {
  onJogarBot: () => void;
  onAtivarAudio: () => void;
  audioLiberado: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void; // ✅ NOVO
}

export default function Menu({
  onJogarBot,
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
        onOpenSettings={onOpenSettings} // ✅ agora funciona
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

        <button className="menu-btn disabled" disabled>
          👥 Jogar com Amigo
        </button>

        <button className="menu-btn disabled" disabled>
          🏆 Ranking
        </button>
      </div>
    </div>
  );
}
