import { searchFoods } from "@/lib/food-provider";
export async function GET(req: Request) {
  const query = (new URL(req.url).searchParams.get("q") || "pizza").trim();
  if (!query || query.length > 80)
    return Response.json(
      { error: "Digite um alimento com até 80 caracteres." },
      { status: 400 },
    );
  try {
    const foods = await searchFoods(query);
    return Response.json(
      { foods, source: "TheMealDB", query },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return Response.json(
      {
        error:
          "Não foi possível consultar os alimentos agora. Tente novamente em instantes.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
