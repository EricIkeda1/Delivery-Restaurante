"use client";
import Link from "@/components/ui/AppLink";
import {
  Wallet,
  ReceiptText,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { OrderCard } from "@/components/orders/OrderCard";
import { money } from "@/lib/format";
export function DashboardPage() {
  const { data, loading, error, reload } = useAsync(api.adminOrders);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const orders = data || [];
  const valid = orders.filter((o) => o.status !== "cancelled");
  const total = valid.reduce((n, o) => n + o.total, 0);
  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">A CASA ESTÁ ABERTA</span>
          <h1>Visão geral</h1>
          <p>O que está acontecendo na sua cozinha.</p>
        </div>
        <Link href="/loja/bella-massa" className="btn secondary">
          Ver minha loja <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="stats-grid">
        <StatCard
          label="Vendas registradas"
          value={money(total)}
          detail="Pedidos demonstrativos"
          icon={Wallet}
        />
        <StatCard
          label="Pedidos recebidos"
          value={String(orders.length).padStart(2, "0")}
          detail="Todos os seus pedidos"
          icon={ReceiptText}
        />
        <StatCard
          label="Ticket médio"
          value={money(valid.length ? total / valid.length : 0)}
          detail="Por pedido válido"
          icon={TrendingUp}
        />
        <StatCard
          label="Na cozinha agora"
          value={String(
            orders.filter((o) => ["new", "preparing"].includes(o.status))
              .length,
          ).padStart(2, "0")}
          detail="Novos e em preparo"
          icon={Clock}
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Vendas da semana</h3>
              <p>Movimento nos últimos 7 dias</p>
            </div>
            <span className="badge">Esta semana</span>
          </div>
          <SalesChart orders={orders} />
        </section>
        <section className="panel kitchen-card">
          <span>🍕</span>
          <h2>
            O próximo pedido
            <br />
            começa no cardápio.
          </h2>
          <p>Mantenha os sabores, preços e disponibilidade sempre em dia.</p>
          <Link href="/restaurante/cardapio" className="btn">
            Gerenciar cardápio
          </Link>
        </section>
      </div>
      <section className="section">
        <div className="section-head">
          <h2>Pedidos recentes</h2>
          <Link className="text-link" href="/restaurante/pedidos">
            Ver todos <ArrowUpRight size={16} />
          </Link>
        </div>
        {orders.length ? (
          <div className="recent-grid">
            {orders.slice(0, 4).map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <p className="muted">
              Os pedidos feitos no delivery aparecerão aqui.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
