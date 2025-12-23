import "./Arena.css";

type Props = {
  escolhaJogador: string | null;
  escolhaOponente: string | null;
  vencedor: "jogador" | "bot" | "empate" | null;
  faseRodada: "escolher" | "jo" | "ken" | "po" | "mostrarResultado";
};

function renderMao(escolha: string | null) {
  if (!escolha) return null;

  if (escolha === "✊") {
    return <img src="/pedra.png" alt="Pedra" className="mao-img" />;
  }

  return <span className="mao-emoji">{escolha}</span>;
}

export default function Arena({
  escolhaJogador,
  escolhaOponente,
  vencedor,
  faseRodada,
}: Props) {
  const maoJogadorClasse =
    faseRodada === "mostrarResultado"
      ? vencedor === "jogador"
        ? "mao win"
        : vencedor === "bot"
        ? "mao lose"
        : "mao"
      : "mao";

  const maoBotClasse =
    faseRodada === "mostrarResultado"
      ? vencedor === "bot"
        ? "mao win"
        : vencedor === "jogador"
        ? "mao lose"
        : "mao"
      : "mao";

  return (
    <div className="arena">
      {(faseRodada === "jo" ||
        faseRodada === "ken" ||
        faseRodada === "po") && (
        <div className="jokenpo">
          <span className={faseRodada === "jo" ? "ativo" : ""}>JO</span>
          <span className={faseRodada === "ken" ? "ativo" : ""}>KEN</span>
          <span className={faseRodada === "po" ? "ativo" : ""}>PO!</span>
        </div>
      )}

      {faseRodada === "mostrarResultado" && (
        <div className="maos">
          <div className={maoJogadorClasse}>
            {renderMao(escolhaJogador)}
          </div>

          <div className={maoBotClasse}>
            {renderMao(escolhaOponente)}
          </div>
        </div>
      )}
    </div>
  );
}
