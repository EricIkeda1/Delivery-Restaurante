"use client";
import { createId } from "@/lib/id";

import { appHref, navigate } from "@/lib/screens";
import { useState } from "react";
import { Loading } from "@/components/ui/Feedback";
import Link from "@/components/ui/AppLink";
import { MapPin, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { api, request } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { totals } from "@/lib/cart";
import type { Order } from "@/types";
export function CheckoutPage() {
  const { items, coupon, clear, ready } = useCart();
  const { data } = useAsync(api.catalog);
  const { data: profile } = useAsync(api.profile);
  const [editedAddress, setAddress] = useState<string | null>(null);
  const address = editedAddress ?? profile?.addresses[0]?.street ?? "";
  const [payment, setPayment] = useState("PIX");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fee =
    data?.restaurants.find((r) => r.id === items[0]?.product.restaurant_id)
      ?.fee ?? 6;
  const summary = totals(items, fee, coupon);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let key = sessionStorage.getItem("eyi-checkout-key");
      if (!key) {
        key = createId();
        sessionStorage.setItem("eyi-checkout-key", key);
      }
      const order = await request<Order>("orders", {
        method: "POST",
        body: JSON.stringify({
          items,
          coupon,
          address,
          payment,
          idempotencyKey: key,
        }),
      });
      clear();
      sessionStorage.removeItem("eyi-checkout-key");
      navigate(appHref("/pedido/" + order.id + "/confirmado"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!ready) return <Loading />;
  if (!items.length)
    return (
      <div className="empty">
        <h2>Sua sacola está vazia</h2>
        <Link className="btn" href="/">
          Escolher meu pedido
        </Link>
      </div>
    );
  return (
    <section className="section narrow">
      <span className="eyebrow">ÚLTIMO PASSO</span>
      <h1>Vai chegar coisa boa.</h1>
      <p className="muted">
        Confirme os detalhes e deixe o resto com a cozinha.
      </p>
      <div className="checkout-steps">
        <span className="active">
          <CheckCircle2 />
          Sacola
        </span>
        <span className="active">
          <MapPin />
          Entrega
        </span>
        <span>
          <CreditCard />
          Confirmação
        </span>
      </div>
      <form className="checkout-grid" onSubmit={submit}>
        <div className="stack">
          <div className="panel">
            <h3>
              <MapPin />
              Onde vamos entregar?
            </h3>
            {profile?.addresses.map((a) => (
              <button
                type="button"
                className={
                  "address-option " + (address === a.street ? "selected" : "")
                }
                onClick={() => setAddress(a.street)}
                key={a.id}
              >
                <b>{a.label}</b>
                <span>{a.street}</span>
              </button>
            ))}
            <label className="field">
              Endereço completo
              <input
                required
                minLength={10}
                maxLength={250}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro, cidade e complemento"
              />
            </label>
          </div>
          <div className="panel">
            <h3>
              <CreditCard />
              Forma de pagamento
            </h3>
            {["PIX", "Cartão de crédito", "Cartão de débito"].map((p) => (
              <label
                key={p}
                className={
                  "payment-option " + (payment === p ? "selected" : "")
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value={p}
                  checked={payment === p}
                  onChange={() => setPayment(p)}
                />
                <span>
                  <b>{p}</b>
                  <small>Simulação • sem cobrança</small>
                </span>
              </label>
            ))}
            <p className="fine-print">
              <ShieldCheck size={15} /> Não informe dados de cartão. Este
              projeto é demonstrativo.
            </p>
          </div>
        </div>
        <aside className="panel">
          <h3>Seu pedido</h3>
          {items.map((i) => (
            <div className="mini-line" key={i.key}>
              <img src={i.product.image} alt="" />
              <span>
                <b>
                  {i.quantity}× {i.product.name}
                </b>
                <small>
                  {i.size} • {i.crust}
                </small>
              </span>
            </div>
          ))}
          <OrderSummary {...summary} />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn full" disabled={busy}>
            {busy ? "Confirmando…" : "Confirmar pedido demonstrativo"}
          </button>
        </aside>
      </form>
    </section>
  );
}
