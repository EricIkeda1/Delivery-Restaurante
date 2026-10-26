import { z } from "zod";
import type { FoodRecipe } from "@/types/foods";
const mealSchema = z
  .object({
    idMeal: z.string().regex(/^\d+$/),
    strMeal: z.string().min(1).max(200),
    strMealThumb: z.string().url(),
    strCategory: z.string().nullable().optional(),
    strArea: z.string().nullable().optional(),
  })
  .passthrough();
export function normalizeMeal(value: unknown): FoodRecipe {
  const meal = mealSchema.parse(value);
  const image = new URL(meal.strMealThumb);
  if (
    image.protocol !== "https:" ||
    !["www.themealdb.com", "themealdb.com"].includes(image.hostname) ||
    !image.pathname.startsWith("/images/media/meals/")
  )
    throw Error("Imagem inválida do fornecedor.");
  const ingredients = Array.from(
    { length: 20 },
    (_, i) => meal["strIngredient" + (i + 1)],
  )
    .filter((v): v is string => typeof v === "string" && Boolean(v.trim()))
    .map((v) => v.trim());
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || "Outros",
    area: meal.strArea || "",
    ingredients,
    source: "TheMealDB",
  };
}
const translations: Record<string, string> = {
  hamburguer: "burger",
  hambúrguer: "burger",
  frango: "chicken",
  carne: "beef",
  peixe: "fish",
  sobremesa: "dessert",
  chocolate: "chocolate",
  massa: "pasta",
  salada: "salad",
  arroz: "rice",
  queijo: "cheese",
  mandioca: "cassava",
  pizza: "pizza",
};
export function foodSearchTerm(value: string) {
  const text = value.trim().slice(0, 80);
  return translations[text.toLowerCase()] || text;
}
export async function searchFoods(query: string): Promise<FoodRecipe[]> {
  const term = foodSearchTerm(query);
  const key = process.env.THEMEALDB_API_KEY || "1";
  const url =
    "https://www.themealdb.com/api/json/v1/" +
    encodeURIComponent(key) +
    "/search.php?s=" +
    encodeURIComponent(term);
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw Error("Fornecedor de alimentos indisponível.");
  const payload = (await response.json()) as { meals?: unknown };
  if (payload.meals === null) return [];
  if (!Array.isArray(payload.meals))
    throw Error("Resposta inválida do fornecedor.");
  return payload.meals.slice(0, 24).flatMap((item) => {
    try {
      return [normalizeMeal(item)];
    } catch {
      return [];
    }
  });
}
export function isAllowedFoodImage(value: string) {
  if (
    [
      "/assets/pizza.jpg",
      "/assets/hero.jpg",
      "/assets/burger.jpg",
      "/assets/sushi.jpg",
    ].includes(value)
  )
    return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["www.themealdb.com", "themealdb.com"].includes(url.hostname) &&
      url.pathname.startsWith("/images/media/meals/") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
