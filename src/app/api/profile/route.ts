import { z } from "zod";
import { db } from "@/lib/db";
import { identity, fail, checkOrigin, HttpError } from "@/lib/server";
const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().max(25),
  addresses: z
    .array(
      z.object({
        id: z.string().uuid(),
        label: z.string().min(1).max(40),
        street: z.string().min(10).max(250),
      }),
    )
    .max(10),
});
export async function GET() {
  try {
    const user = await identity();
    const rows =
      await db()`SELECT name,phone,addresses FROM profiles WHERE user_id=${user.userId}`;
    return Response.json(
      rows[0] ?? { name: user.displayName, phone: "", addresses: [] },
    );
  } catch (e) {
    return fail(e);
  }
}
export async function PUT(req: Request) {
  try {
    checkOrigin(req);
    const user = await identity();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success)
      throw new HttpError("Confira seu nome e os endereços informados.");
    const p = parsed.data;
    await db()`INSERT INTO profiles(user_id,name,phone,addresses) VALUES(${user.userId},${p.name},${p.phone},${JSON.stringify(p.addresses)}::jsonb) ON CONFLICT(user_id) DO UPDATE SET name=excluded.name,phone=excluded.phone,addresses=excluded.addresses`;
    return Response.json(p);
  } catch (e) {
    return fail(e);
  }
}
