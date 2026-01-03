import { useState } from "react";
import { socket } from "../socket";
import "./OnlineModal.css";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSalaPronta: (roomId: string) => void;
}

type Etapa = "escolha" | "criando" | "entrando";

export default function OnlineModal({
  aberto,
  onFechar,
  onSalaPronta,
}: Props) {
  const [etapa, setEtapa] = useState<Etapa>("escolha");
  const [codigoSala, setCodigoSala] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!aberto) return null;

  /* ========================= */
  /* AÇÕES */
  /* ========================= */
  function criarSala() {
    setCarregando(true);
    setEtapa("criando");

    socket.emit("CREATE_ROOM", {
      rodadas: 3,
      dificuldade: "normal",
    });

    socket.once("ROOM_CREATED", ({ roomId }) => {
      setCodigoSala(roomId);
      setCarregando(false);
    });
  }

  function entrarSala() {
    if (!codigoSala) return;

    setCarregando(true);

    socket.emit("JOIN_ROOM", {
      roomId: codigoSala.toUpperCase(),
    });

    socket.once("JOIN_ROOM_ERROR", () => {
      setCarregando(false);
      alert("Sala inválida ou cheia");
    });

    socket.once("PLAYER_JOINED", () => {
      setCarregando(false);
      onSalaPronta(codigoSala.toUpperCase());
    });
  }

  function copiarCodigo() {
    navigator.clipboard.writeText(codigoSala);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  /* ========================= */
  /* UI */
  /* ========================= */
  return (
    <div className="online-modal-overlay">
      <div className="online-modal">
        <button
          className="online-modal-close"
          type="button"
          onClick={onFechar}
        >
          ✕
        </button>

        {etapa === "escolha" && (
          <>
            <h2>Jogar Online</h2>

            <button
              type="button"
              className="online-btn"
              onClick={criarSala}
            >
              ➕ Criar sala
            </button>

            <button
              type="button"
              className="online-btn"
              onClick={() => setEtapa("entrando")}
            >
              🔑 Entrar em sala
            </button>
          </>
        )}

        {etapa === "criando" && (
          <>
            <h2>Sala criada</h2>

            <div className="codigo-sala">
              <span>{codigoSala || "----"}</span>
              <button type="button" onClick={copiarCodigo}>
                📋
              </button>
            </div>

            {copiado && <p className="copiado">Código copiado!</p>}

            <p className="aguardando">
              ⏳ Aguardando outro jogador entrar…
            </p>

            {carregando && <span className="loader" />}

            {/* Quando o outro jogador entrar */}
            {codigoSala && (
              <button
                type="button"
                className="online-btn iniciar"
                onClick={() => onSalaPronta(codigoSala)}
              >
                Iniciar partida
              </button>
            )}
          </>
        )}

        {etapa === "entrando" && (
          <>
            <h2>Entrar em sala</h2>

            <input
              value={codigoSala}
              onChange={e => setCodigoSala(e.target.value.toUpperCase())}
              placeholder="Código da sala"
              maxLength={4}
            />

            <button
              type="button"
              className="online-btn"
              onClick={entrarSala}
              disabled={carregando}
            >
              Entrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
