import { z } from "zod";
import { db } from "@/lib/db";
import { owner, fail, checkOrigin, HttpError } from "@/lib/server";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().min(2).max(500),
  fee: z.number().min(0).max(100),
  minimum: z.number().min(0).max(500),
  minutes: z.number().int().min(5).max(180),
  open: z.boolean(),
  address: z.string().min(5).max(250),
  hours: z.string().min(3).max(100),
});
export async function GET() {
  try {
    const rows =
      await db()`SELECT data FROM store_settings WHERE restaurant_id='bella-massa'`;
    return Response.json(rows[0]?.data);
  } catch (e) {
    return fail(e);
  }
}
export async function PUT(req: Request) {
  try {
    checkOrigin(req);
    await owner();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) throw new HttpError("Confira os dados da loja.");
    const p = parsed.data;
    const sql = db();
    await sql.transaction([
      sql`UPDATE store_settings SET data=${JSON.stringify(p)}::jsonb WHERE restaurant_id='bella-massa'`,
      sql`UPDATE restaurants SET name=${p.name},description=${p.description},fee=${p.fee},minutes=${p.minutes} WHERE id='bella-massa'`,
    ]);
    return Response.json(p);
  } catch (e) {
    return fail(e);
  }
}
