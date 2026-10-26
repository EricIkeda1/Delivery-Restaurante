import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import ts from "typescript";
const directory = mkdtempSync(path.join(process.cwd(), "tests", ".food-test-"));
const runtime = path.join(directory, "provider.mjs");
writeFileSync(
  runtime,
  ts.transpileModule(readFileSync("src/lib/food-provider.ts", "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText,
);
after(() => rmSync(directory, { recursive: true, force: true }));
const { normalizeMeal, foodSearchTerm, isAllowedFoodImage, searchFoods } =
  await import(pathToFileURL(runtime).href);
const valid = {
  idMeal: "53014",
  strMeal: "Pizza Express Margherita",
  strMealThumb: "https://www.themealdb.com/images/media/meals/pizza.jpg",
  strCategory: "Miscellaneous",
  strArea: "Italian",
  strIngredient1: " Mozzarella ",
  strIngredient2: "",
  strIngredient3: null,
  strIngredient4: "Basil",
};
test("provider normalizes variable ingredients and preserves source identity", () => {
  const food = normalizeMeal(valid);
  assert.deepEqual(food.ingredients, ["Mozzarella", "Basil"]);
  assert.equal(food.id, "53014");
  assert.equal(food.source, "TheMealDB");
});
test("image allowlist rejects untrusted hosts, HTTP and embedded credentials", () => {
  assert.equal(isAllowedFoodImage(valid.strMealThumb), true);
  assert.equal(
    isAllowedFoodImage(
      "https://www.themealdb.com.evil.test/images/media/meals/a.jpg",
    ),
    false,
  );
  assert.equal(
    isAllowedFoodImage("http://www.themealdb.com/images/media/meals/a.jpg"),
    false,
  );
  assert.equal(
    isAllowedFoodImage(
      "https://user:secret@www.themealdb.com/images/media/meals/a.jpg",
    ),
    false,
  );
  assert.throws(() =>
    normalizeMeal({ ...valid, strMealThumb: "https://evil.test/pizza.jpg" }),
  );
});
test("common Portuguese searches map to upstream terms", () => {
  assert.equal(foodSearchTerm(" Frango "), "chicken");
  assert.equal(foodSearchTerm("hambúrguer"), "burger");
  assert.equal(foodSearchTerm("Pizza Express"), "Pizza Express");
});
test("upstream empty results and invalid responses are distinguished", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      assert.match(url, /search.php\?s=pizza$/);
      return new Response(JSON.stringify({ meals: null }), { status: 200 });
    };
    assert.deepEqual(await searchFoods("pizza"), []);
    globalThis.fetch = async () => new Response("{}", { status: 200 });
    await assert.rejects(() => searchFoods("pizza"));
    globalThis.fetch = async () => new Response("", { status: 503 });
    await assert.rejects(() => searchFoods("pizza"));
  } finally {
    globalThis.fetch = original;
  }
});
