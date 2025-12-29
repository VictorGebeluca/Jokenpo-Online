import "./TopBar.css";

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings?: () => void;
}

export default function TopBar({
  isMuted,
  onToggleMute,
  onOpenSettings,
}: Props) {
  return (
    <div className="topbar">
      {/* CONFIGURAÇÕES */}
      <button
        type="button"
        className="topbar-btn"
        onClick={onOpenSettings}
        aria-label="Configurações"
      >
        <img
          src="/engrenagem.png"
          alt="Configurações"
          className="topbar-icon"
        />
      </button>

      {/* SOM */}
      <button
        type="button"
        className="topbar-btn"
        onClick={onToggleMute}
        aria-label="Som"
      >
       <img
  src={isMuted ? "/Mute.png" : "/MuteOn.png"}
  alt={isMuted ? "Som desligado" : "Som ligado"}
  className={`topbar-icon ${!isMuted ? "topbar-icon--active" : ""}`}
/>

      </button>
    </div>
  );
}
