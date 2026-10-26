import { z } from "zod";
import { db } from "@/lib/db";
import {
  identity,
  owner,
  fail,
  checkOrigin,
  HttpError,
  numeric,
} from "@/lib/server";
import { itemPrice, extraOptions, totals } from "@/lib/cart";
import type { CartItem, Product, OrderStatus } from "@/types";
const itemSchema = z.object({
  product: z.object({ id: z.string().min(1).max(100) }),
  quantity: z.number().int().min(1).max(20),
  size: z.enum(["Pequena", "Média", "Grande"]),
  crust: z.enum(["Tradicional", "Fina", "Integral"]),
  extras: z.array(z.string()).max(4),
  note: z.string().max(200),
});
const schema = z.object({
  items: z.array(itemSchema).min(1).max(30),
  coupon: z.enum(["", "PIZZA10"]),
  address: z.string().trim().min(10).max(250),
  payment: z.enum(["PIX", "Cartão de crédito", "Cartão de débito"]),
  idempotencyKey: z.string().uuid(),
});
export async function GET(req: Request) {
  try {
    const user = await identity();
    const sql = db();
    const adminScope =
      new URL(req.url).searchParams.get("scope") === "restaurant";
    if (adminScope) await owner();
    const rows = adminScope
      ? await sql`SELECT * FROM orders WHERE restaurant_id='bella-massa' ORDER BY created_at DESC LIMIT 200`
      : await sql`SELECT * FROM orders WHERE user_id=${user.userId} ORDER BY created_at DESC LIMIT 200`;
    return Response.json(rows.map(numeric));
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const user = await identity();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success)
      throw new HttpError("Confira os itens, endereço e forma de pagamento.");
    const p = parsed.data;
    const sql = db();
    const existing =
      await sql`SELECT * FROM orders WHERE user_id=${user.userId} AND idempotency_key=${p.idempotencyKey}`;
    if (existing[0]) return Response.json(numeric(existing[0]));
    const ids = p.items.map((i) => i.product.id);
    const products = (
      await sql`SELECT * FROM products WHERE id=ANY(${ids}) AND active=true`
    ).map(numeric) as unknown as Product[];
    const items: CartItem[] = p.items.map((i) => {
      const product = products.find((x) => x.id === i.product.id);
      if (!product)
        throw new HttpError(
          "Um produto não está mais disponível. Atualize sua sacola.",
        );
      if (
        new Set(i.extras).size !== i.extras.length ||
        i.extras.some((x) => !extraOptions.some((e) => e.name === x))
      )
        throw new HttpError("Adicional inválido.");
      if (
        product.category !== "Pizzas" &&
        (i.size !== "Média" || i.crust !== "Tradicional" || i.extras.length)
      )
        throw new HttpError("Personalização inválida para este produto.");
      return {
        ...i,
        product,
        key: JSON.stringify([product.id, i.size, i.crust, i.extras, i.note]),
        unitPrice: itemPrice(product, i.size, i.extras),
      };
    });
    const restaurantId = items[0].product.restaurant_id;
    if (items.some((i) => i.product.restaurant_id !== restaurantId))
      throw new HttpError(
        "O pedido deve conter itens de um único restaurante.",
      );
    const stores =
      await sql`SELECT * FROM restaurants WHERE id=${restaurantId}`;
    const settings =
      await sql`SELECT data FROM store_settings WHERE restaurant_id=${restaurantId}`;
    const config = settings[0]?.data;
    if (config && !config.open)
      throw new HttpError("A loja está fechada no momento.");
    const summary = totals(items, Number(stores[0].fee), p.coupon);
    if (config && summary.subtotal < config.minimum)
      throw new HttpError(
        "Pedido mínimo da loja: R$ " + config.minimum.toFixed(2),
      );
    const rows =
      await sql`INSERT INTO orders(user_id,restaurant_id,items,subtotal,discount,fee,total,address,payment,idempotency_key) VALUES(${user.userId},${restaurantId},${JSON.stringify(items)}::jsonb,${summary.subtotal},${summary.discount},${summary.fee},${summary.total},${p.address},${p.payment},${p.idempotencyKey}) ON CONFLICT(user_id,idempotency_key) DO UPDATE SET idempotency_key=excluded.idempotency_key RETURNING *`;
    return Response.json(numeric(rows[0]), { status: 201 });
  } catch (e) {
    return fail(e);
  }
}
const transitions: Record<string, string[]> = {
  new: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivering"],
  delivering: ["delivered"],
  delivered: [],
  cancelled: [],
};
export async function PATCH(req: Request) {
  try {
    checkOrigin(req);
    await owner();
    const parsed = z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "preparing",
          "ready",
          "delivering",
          "delivered",
          "cancelled",
        ]),
      })
      .safeParse(await req.json());
    if (!parsed.success) throw new HttpError("Status inválido.");
    const p = parsed.data;
    const sql = db();
    const rows =
      await sql`SELECT * FROM orders WHERE id=${p.id} AND restaurant_id='bella-massa'`;
    const current = rows[0];
    if (!current) throw new HttpError("Pedido não encontrado.", 404);
    if (!transitions[current.status as OrderStatus]?.includes(p.status))
      throw new HttpError("Esta mudança de status não é permitida.");
    const changed =
      await sql`UPDATE orders SET status=${p.status} WHERE id=${p.id} AND status=${current.status} RETURNING *`;
    if (!changed[0])
      throw new HttpError("O pedido foi atualizado. Recarregue a página.", 409);
    return Response.json(numeric(changed[0]));
  } catch (e) {
    return fail(e);
  }
}
