import { LoaderCircle, AlertCircle } from "lucide-react";
export function Loading() {
  return (
    <div className="empty">
      <LoaderCircle className="spin" />
      <p>Preparando tudo para você…</p>
    </div>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="empty">
      <AlertCircle />
      <h3>Algo não saiu como esperado</h3>
      <p>{message}</p>
      {retry && (
        <button className="btn" onClick={retry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
