import { getCurrentUser } from "@/lib/auth";
export class HttpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function identity() {
  const user = await getCurrentUser();
  if (!user) throw new HttpError("Entre na sua conta para continuar.", 401);
  return user;
}
export async function owner() {
  const user = await identity();
  if (!(await isOwner(user.userId))) {
    throw new HttpError("Acesso restrito ao proprietário do restaurante.", 403);
  }
  return user;
}
export async function isOwner(userId: string) {
  const ownerId = process.env.OWNER_GITHUB_ID;
  return Boolean(ownerId) && userId === ownerId;
}
export function fail(e: unknown) {
  if (e instanceof HttpError)
    return Response.json({ error: e.message }, { status: e.status });
  console.error("EYI API failure", e instanceof Error ? e.name : "unknown");
  return Response.json(
    { error: "Não foi possível acessar os dados. Tente novamente." },
    { status: 500 },
  );
}
export function numeric<T extends Record<string, unknown>>(row: T) {
  const out = { ...row };
  for (const key of [
    "price",
    "fee",
    "rating",
    "minutes",
    "subtotal",
    "discount",
    "total",
    "minimum",
  ])
    if (key in out) (out as Record<string, unknown>)[key] = Number(out[key]);
  return out;
}
export function checkOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    throw new HttpError("Origem inválida.", 403);
}
