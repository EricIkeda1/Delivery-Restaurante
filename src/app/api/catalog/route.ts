import { db } from "@/lib/db";
import { fail, numeric } from "@/lib/server";
export async function GET() {
  try {
    const sql = db();
    const [restaurants, products] = await Promise.all([
      sql`SELECT r.*,COALESCE((s.data->>'open')::boolean,true) AS open,COALESCE((s.data->>'minimum')::numeric,0) AS minimum FROM restaurants r LEFT JOIN store_settings s ON s.restaurant_id=r.id ORDER BY CASE WHEN r.id='bella-massa' THEN 0 ELSE 1 END,r.name`,
      sql`SELECT * FROM products ORDER BY name`,
    ]);
    return Response.json({
      restaurants: restaurants.map(numeric),
      products: products.map(numeric),
    });
  } catch (e) {
    return fail(e);
  }
}
