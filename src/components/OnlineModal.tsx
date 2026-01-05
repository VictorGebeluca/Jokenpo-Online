import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./OnlineModal.css";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSalaPronta: (roomId: string) => void;
}

type Etapa = "menu" | "criar" | "entrar";

export default function OnlineModal({
  aberto,
  onFechar,
  onSalaPronta,
}: Props) {
  const [etapa, setEtapa] = useState<Etapa>("menu");
  const [codigoSala, setCodigoSala] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [carregando, setCarregando] = useState(false);

  /* ========================= */
  /* RESET */
  /* ========================= */
  useEffect(() => {
    if (!aberto) {
      setEtapa("menu");
      setCodigoSala("");
      setCodigoInput("");
      setCarregando(false);
    }
  }, [aberto]);

  if (!aberto) return null;

  /* ========================= */
  /* CRIAR SALA */
  /* ========================= */
  function criarSala() {
    setCarregando(true);

    socket.emit("CREATE_ROOM", {
      rodadas: 3,
      dificuldade: "normal",
    });

    socket.once("ROOM_CREATED", ({ roomId }) => {
      setCodigoSala(roomId);
      setEtapa("criar");
      setCarregando(false);

      // 🔥 JOGADOR 1 JÁ ENTRA NO MODO ONLINE
      onSalaPronta(roomId);
      onFechar();
    });
  }

  /* ========================= */
  /* ENTRAR SALA */
  /* ========================= */
  function entrarSala() {
    if (!codigoInput) return;

    setCarregando(true);

    socket.emit("JOIN_ROOM", {
      roomId: codigoInput,
    });

    socket.once("JOIN_ROOM_SUCCESS", ({ roomId }) => {
      setCarregando(false);

      // 🔥 JOGADOR 2 ENTRA DIRETO
      onSalaPronta(roomId);
      onFechar();
    });

    socket.once("JOIN_ROOM_ERROR", ({ message }) => {
      setCarregando(false);
      alert(message);
    });
  }

  /* ========================= */
  /* UI */
  /* ========================= */
  return (
    <div className="modal-backdrop">
      <div className="modal online">
        <button className="fechar" onClick={onFechar}>✖</button>

        {etapa === "menu" && (
          <>
            <h2>Jogar Online</h2>

            <button
              className="online-btn"
              onClick={criarSala}
              disabled={carregando}
            >
              Criar sala
            </button>

            <button
              className="online-btn secundario"
              onClick={() => setEtapa("entrar")}
            >
              Entrar em sala
            </button>
          </>
        )}

        {etapa === "entrar" && (
          <>
            <h2>Entrar em sala</h2>

            <input
              value={codigoInput}
              onChange={e =>
                setCodigoInput(e.target.value.toUpperCase())
              }
              placeholder="Código"
            />

            <button
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
