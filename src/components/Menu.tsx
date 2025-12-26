import "./Menu.css";

interface Props {
  onJogarBot: () => void;
  onAtivarAudio: () => void;
  audioLiberado: boolean;
}

export default function Menu({
  onJogarBot,
  onAtivarAudio,
  audioLiberado,
}: Props) {
  return (
    <div className="menu">
      {/* OVERLAY DE INÍCIO */}
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
