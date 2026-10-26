export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const statusLabels: Record<string, string> = {
  new: "Novo",
  preparing: "Em preparo",
  ready: "Pronto",
  delivering: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};
