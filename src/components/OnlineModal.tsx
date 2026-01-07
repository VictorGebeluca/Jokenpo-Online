import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./OnlineModal.css";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSalaPronta: (roomId: string) => void;
}

type Etapa = "menu" | "configurar" | "criar" | "entrar";

export default function OnlineModal({
  aberto,
  onFechar,
  onSalaPronta,
}: Props) {
  const [etapa, setEtapa] = useState<Etapa>("menu");
  const [codigoSala, setCodigoSala] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [carregando, setCarregando] = useState(false);

  // 🔥 RODADAS (SÓ APARECE DEPOIS DE CLICAR CRIAR)
  const [rodadas, setRodadas] = useState<number | null>(null);

  /* ========================= */
  /* RESET AO FECHAR */
  /* ========================= */
  useEffect(() => {
    if (!aberto) {
      setEtapa("menu");
      setCodigoSala("");
      setCodigoInput("");
      setCarregando(false);
      setRodadas(null);
    }
  }, [aberto]);

  if (!aberto) return null;

  /* ========================= */
  /* CRIAR SALA (CONFIRMADO) */
  /* ========================= */
  function confirmarCriacao() {
    if (!rodadas) return;

    setCarregando(true);

    socket.emit("CREATE_ROOM", {
      rodadas,
      dificuldade: "normal",
    });

    socket.once("ROOM_CREATED", ({ roomId }) => {
      setCodigoSala(roomId);
      setEtapa("criar");
      setCarregando(false);

      onSalaPronta(roomId);
    });
  }

  /* ========================= */
  /* ENTRAR NA SALA */
  /* ========================= */
  function entrarSala() {
    if (!codigoInput) return;

    setCarregando(true);

    socket.emit("JOIN_ROOM", {
      roomId: codigoInput,
    });

    socket.once("JOIN_ROOM_SUCCESS", ({ roomId }) => {
      setCarregando(false);
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

        {/* MENU */}
        {etapa === "menu" && (
          <>
            <h2>Jogar Online</h2>

            <button
              className="online-btn"
              onClick={() => setEtapa("configurar")}
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

        {/* CONFIGURAÇÃO DE RODADAS */}
        {etapa === "configurar" && (
          <>
            <h2>Escolha as rodadas</h2>

            <div className="rodadas-opcoes">
              {[3, 6, 9].map(r => (
                <button
                  key={r}
                  className={`rodada-btn ${rodadas === r ? "ativa" : ""}`}
                  onClick={() => setRodadas(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              className="online-btn"
              disabled={!rodadas || carregando}
              onClick={confirmarCriacao}
            >
              Criar partida
            </button>
          </>
        )}

        {/* SALA CRIADA */}
        {etapa === "criar" && (
          <>
            <h2>Sala criada</h2>

            <div className="codigo-sala">
              <span>{codigoSala}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(codigoSala)
                }
              >
                📋
              </button>
            </div>

            <p className="aguardando">
              Aguardando outro jogador…
            </p>

            <p className="info-rodadas">
              Rodadas: <strong>{rodadas}</strong>
            </p>
          </>
        )}

        {/* ENTRAR EM SALA */}
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
