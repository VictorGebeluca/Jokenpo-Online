import "./BarraEscolhas.css";

interface Props {
  onEscolher: (escolha: string) => void;
}

export default function BarraEscolhas({ onEscolher }: Props) {
  return (
    <div className="barra">
      <button className="botao" onClick={() => onEscolher("✊")}>
        <img src="/pedra.png" alt="Pedra" className="mao-img" />
      </button>

      <button className="botao" onClick={() => onEscolher("✋")}>
        ✋
      </button>

      <button className="botao" onClick={() => onEscolher("✌️")}>
        ✌️
      </button>
    </div>
  );
}
