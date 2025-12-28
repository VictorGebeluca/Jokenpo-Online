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
      {/* ⚙️ CONFIGURAÇÕES */}
      <button
        type="button"
        className="topbar-btn"
        onClick={onOpenSettings}
        aria-label="Configurações"
      >
        ⚙️
      </button>

      {/* 🔊 / 🔇 SOM */}
      <button
        type="button"
        className="topbar-btn"
        onClick={onToggleMute}
        aria-label="Som"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
