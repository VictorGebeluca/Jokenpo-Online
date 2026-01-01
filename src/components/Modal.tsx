import "./Modal.css";
import type { Dificuldade } from "../game/regras";

/* ========================= */
/* BASE */
/* ========================= */
interface BaseProps {
  aberto: boolean;
  tipo: "menu" | "jogo";
  onFechar: () => void;
}

/* ========================= */
/* MENU */
/* ========================= */
interface MenuProps extends BaseProps {
  tipo: "menu";
  musica: boolean;
  efeitos: boolean;
  rodadas: number;
  dificuldade: Dificuldade;
  onToggleMusica: () => void;
  onToggleEfeitos: () => void;
  onChangeRodadas: (v: number) => void;
  onChangeDificuldade: (v: Dificuldade) => void;
}

/* ========================= */
/* JOGO */
/* ========================= */
interface JogoProps extends BaseProps {
  tipo: "jogo";
  musica: boolean;
  efeitos: boolean;
  onToggleMusica: () => void;
  onToggleEfeitos: () => void;
  onSair: () => void;
}

type Props = MenuProps | JogoProps;

/* ========================= */
/* COMPONENTE */
/* ========================= */
export default function Modal(props: Props) {
  if (!props.aberto) return null;

  return (
    <div className="modal-overlay" onClick={props.onFechar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>⚙️ Configurações</h2>

        {/* 🔊 Música */}
        <div className="modal-item">
          Música
          <label className="toggle">
            <input
              type="checkbox"
              checked={props.musica}
              onChange={props.onToggleMusica}
            />
            <span className="slider" />
          </label>
        </div>

        {/* 🔔 Efeitos */}
        <div className="modal-item">
          Efeitos
          <label className="toggle">
            <input
              type="checkbox"
              checked={props.efeitos}
              onChange={props.onToggleEfeitos}
            />
            <span className="slider" />
          </label>
        </div>

        {/* 🔢 APENAS MENU */}
        {props.tipo === "menu" && (
          <>
            <div className="modal-item">
              Rodadas
              <select
                value={props.rodadas}
                onChange={(e) =>
                  props.onChangeRodadas(Number(e.target.value))
                }
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </div>

            <div className="modal-item">
              Dificuldade
              <select
                value={props.dificuldade}
                onChange={(e) =>
                  props.onChangeDificuldade(
                    e.target.value as Dificuldade
                  )
                }
              >
                <option value="facil">Fácil</option>
                <option value="normal">Normal</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </>
        )}

        {/* 🚪 APENAS JOGO */}
        {props.tipo === "jogo" && (
          <button className="modal-exit" onClick={props.onSair}>
            Sair do jogo
          </button>
        )}

        <button className="modal-close" onClick={props.onFechar}>
          Fechar
        </button>
      </div>
    </div>
  );
}
