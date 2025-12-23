import "./BarraEscolhas.css";

interface Props {
  onEscolher: (e: string) => void;
  bloqueado: boolean;
}

export default function BarraEscolhas({ onEscolher, bloqueado }: Props) {
  return (
    <div className="barra">
      {["✊", "✋", "✌️"].map((e) => (
        <button
          key={e}
          className="botao"
          disabled={bloqueado}
          onClick={() => onEscolher(e)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
