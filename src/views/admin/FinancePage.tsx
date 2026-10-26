"use client";
import { Wallet, TrendingUp, ReceiptText } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { money, statusLabels } from "@/lib/format";
export function FinancePage() {
  const { data, loading, error, reload } = useAsync(api.adminOrders);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const orders = data || [];
  const valid = orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((n, o) => n + o.total, 0);
  const delivered = valid
    .filter((o) => o.status === "delivered")
    .reduce((n, o) => n + o.total, 0);
  function download() {
    const text =
      "Pedido;Data;Status;Total\n" +
      orders
        .map((o) =>
          [
            o.id,
            new Date(o.created_at).toLocaleDateString("pt-BR"),
            statusLabels[o.status],
            o.total.toFixed(2).replace(".", ","),
          ].join(";"),
        )
        .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8;" }),
    );
    a.download = "eyi-food-financeiro.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">OS NÚMEROS DA SUA COZINHA</span>
          <h1>Financeiro</h1>
          <p>Acompanhe as vendas dos pedidos demonstrativos.</p>
        </div>
        <button className="btn secondary" onClick={download}>
          Exportar CSV
        </button>
      </div>
      <div className="stats-grid three">
        <StatCard
          label="Vendas totais"
          value={money(revenue)}
          detail="Exclui pedidos cancelados"
          icon={Wallet}
        />
        <StatCard
          label="Pedidos entregues"
          value={money(delivered)}
          detail="Valor dos pedidos concluídos"
          icon={TrendingUp}
        />
        <StatCard
          label="Em andamento"
          value={money(revenue - delivered)}
          detail="Pedidos ainda não entregues"
          icon={ReceiptText}
        />
      </div>
      <div className="panel">
        <h3>Movimento dos últimos 7 dias</h3>
        <SalesChart orders={orders} />
      </div>
      <div className="panel section">
        <h3>Últimas movimentações</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Forma</th>
                <th>Situação</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id.slice(0, 6).toUpperCase()}</td>
                  <td>{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                  <td>{o.payment}</td>
                  <td>{statusLabels[o.status]}</td>
                  <td>{money(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && (
            <p className="muted">Nenhuma movimentação registrada.</p>
          )}
        </div>
      </div>
      <p className="fine-print">
        Os valores representam uma simulação. Não há processamento de
        pagamentos, repasses ou integração bancária.
      </p>
    </>
  );
}
