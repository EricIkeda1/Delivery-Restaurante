import type { Order } from "@/types";
import { money } from "@/lib/format";
export function SalesChart({ orders }: { orders: Order[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return {
      label: d
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", ""),
      value: orders
        .filter(
          (o) =>
            o.status !== "cancelled" &&
            new Date(o.created_at).toDateString() === d.toDateString(),
        )
        .reduce((n, o) => n + o.total, 0),
    };
  });
  const max = Math.max(1, ...days.map((d) => d.value));
  return (
    <div className="sales-chart">
      {days.map((d, i) => (
        <div key={i}>
          <div className="bar-track">
            <span
              style={{ height: Math.max((d.value / max) * 100, 2) + "%" }}
              title={money(d.value)}
            >
              <em>{money(d.value)}</em>
            </span>
          </div>
          <small>{d.label}</small>
        </div>
      ))}
    </div>
  );
}
