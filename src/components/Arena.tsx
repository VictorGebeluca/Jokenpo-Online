import "./Arena.css";

type Props = {
  escolhaJogador: string | null;
  escolhaOponente: string | null;
  vencedor: "jogador" | "bot" | "empate" | null;
  faseRodada: "escolher" | "jo" | "ken" | "po" | "mostrarResultado";
};

export default function Arena({
  escolhaJogador,
  escolhaOponente,
  vencedor,
  faseRodada,
}: Props) {
  const maoJogadorClasse =
    faseRodada === "mostrarResultado"
      ? vencedor === "jogador"
        ? "mao jogador win"
        : "mao jogador lose"
      : "mao jogador";

  const maoBotClasse =
    faseRodada === "mostrarResultado"
      ? vencedor === "bot"
        ? "mao bot win"
        : "mao bot lose"
      : "mao bot";

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
          <div className={maoJogadorClasse}>{escolhaJogador}</div>
          <div className={maoBotClasse}>{escolhaOponente}</div>
        </div>
      )}
    </div>
  );
}
