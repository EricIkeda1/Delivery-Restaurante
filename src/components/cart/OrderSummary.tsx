import { money } from "@/lib/format";
export function OrderSummary({
  subtotal,
  discount,
  fee,
  total,
}: {
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
}) {
  return (
    <div className="summary">
      <div>
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="green">
          <span>Desconto</span>
          <span>− {money(discount)}</span>
        </div>
      )}
      <div>
        <span>Taxa de entrega</span>
        <span>{fee === 0 ? "Grátis" : money(fee)}</span>
      </div>
      <div className="total">
        <b>Total</b>
        <strong>{money(total)}</strong>
      </div>
    </div>
  );
}
