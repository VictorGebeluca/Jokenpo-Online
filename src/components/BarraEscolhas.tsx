import "./BarraEscolhas.css";
import type { Escolha } from "../game/regras";


interface Props {
  onEscolher: (escolha: Escolha) => void;
}

export default function BarraEscolhas({ onEscolher }: Props) {
  return (
    <div className="barra">
      <button onClick={() => onEscolher("pedra")}>
        <img src="/pedra.png" alt="Pedra" />
      </button>

      <button onClick={() => onEscolher("papel")}>
        <img src="/papel.png" alt="Papel" />
      </button>

      <button onClick={() => onEscolher("tesoura")}>
        <img src="/tesoura.png" alt="Tesoura" />
      </button>
    </div>
  );
}
