import "./Arena.css";

type Props = {
  escolhaJogador: "pedra" | "papel" | "tesoura" | null;
  escolhaOponente: "pedra" | "papel" | "tesoura" | null;
  faseRodada: "escolher" | "jo" | "ken" | "po" | "mostrarResultado";
};

function imagem(mao: string | null) {
  if (!mao) return null;
  return <img src={`/${mao}.png`} alt={mao} />;
}

export default function Arena({
  escolhaJogador,
  escolhaOponente,
  faseRodada,
}: Props) {
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
          <div className="mao">{imagem(escolhaJogador)}</div>
          <div className="mao">{imagem(escolhaOponente)}</div>
        </div>
      )}
    </div>
  );
}
