import { isAllowedFoodImage } from "@/lib/food-provider";
import { z } from "zod";
import { db } from "@/lib/db";
import { owner, fail, checkOrigin, HttpError, numeric } from "@/lib/server";
const schema = z.object({
  id: z.string().min(1).max(100).optional(),
  name: z.string().trim().min(2).max(100),
  description: z.string().min(2).max(500),
  price: z.number().min(1).max(9999),
  category: z.enum([
    "Pizzas",
    "Pratos",
    "Lanches",
    "Combinados",
    "Bebidas",
    "Sobremesas",
  ]),
  image: z.string().max(500).refine(isAllowedFoodImage),
  active: z.boolean(),
});
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    await owner();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) throw new HttpError("Confira os campos do produto.");
    const p = parsed.data;
    const id = p.id ?? crypto.randomUUID();
    const rows =
      await db()`INSERT INTO products(id,restaurant_id,name,description,price,category,image,active) VALUES(${id},'bella-massa',${p.name},${p.description},${p.price},${p.category},${p.image},${p.active}) ON CONFLICT(id) DO UPDATE SET name=excluded.name,description=excluded.description,price=excluded.price,category=excluded.category,image=excluded.image,active=excluded.active WHERE products.restaurant_id='bella-massa' RETURNING *`;
    if (!rows.length)
      throw new HttpError("Produto não pertence à sua loja.", 403);
    return Response.json(numeric(rows[0]));
  } catch (e) {
    return fail(e);
  }
}
