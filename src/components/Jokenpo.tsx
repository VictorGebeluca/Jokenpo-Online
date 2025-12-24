import "./Jokenpo.css";

interface Props {
  visivel: boolean;
}

export default function Jokenpo({ visivel }: Props) {
  if (!visivel) return null;

  return (
    <div className="jokenpo-overlay">
      <span className="jokenpo-texto">JO</span>
      <span className="jokenpo-texto delay1">KEN</span>
      <span className="jokenpo-texto delay2">PO!</span>
    </div>
  );
}
