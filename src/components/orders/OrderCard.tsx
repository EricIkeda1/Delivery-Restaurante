import Link from "@/components/ui/AppLink";
import { ChevronRight } from "lucide-react";
import type { Order } from "@/types";
import { money, statusLabels } from "@/lib/format";
export function OrderCard({
  order: o,
  onRepeat,
  busy = false,
}: {
  order: Order;
  onRepeat?: () => void;
  busy?: boolean;
}) {
  return (
    <article className="order-card">
      <Link href={"/pedido/" + o.id}>
        <div className="row">
          <b>Pedido #{o.id.slice(0, 6).toUpperCase()}</b>
          <span className={"status " + o.status}>{statusLabels[o.status]}</span>
        </div>
        <div className="mini-line">
          <img src={o.items[0]?.product.image || "/assets/pizza.jpg"} alt="" />
          <div className="grow">
            <h3>
              {o.items
                .map((i) => i.quantity + "× " + i.product.name)
                .join(", ")}
            </h3>
            <p>
              {new Date(o.created_at).toLocaleDateString("pt-BR")} •{" "}
              {money(o.total)}
            </p>
          </div>
          <ChevronRight />
        </div>
      </Link>
      {onRepeat && (
        <button
          className="btn secondary full"
          disabled={busy}
          onClick={onRepeat}
        >
          {busy ? "Preparando sacola…" : "Pedir novamente"}
        </button>
      )}
    </article>
  );
}
