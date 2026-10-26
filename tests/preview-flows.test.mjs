import test, { after } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  rmSync,
  mkdirSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const directory = mkdtempSync(
  path.join(process.cwd(), "tests", ".preview-test-"),
);
for (const name of [
  "lib/id",
  "lib/cart",
  "lib/demo-catalog-products",
  "lib/preview-data",
  "services/preview",
]) {
  const target = path.join(directory, name + ".mjs");
  mkdirSync(path.dirname(target), { recursive: true });
  let source = ts.transpileModule(readFileSync("src/" + name + ".ts", "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;
  source = source.replace(
    /(["'])@\/([^"']+)\1/g,
    (_, quote, file) =>
      quote + pathToFileURL(path.join(directory, file + ".mjs")).href + quote,
  );
  writeFileSync(target, source);
}
after(() => rmSync(directory, { recursive: true, force: true }));
const values = new Map();
globalThis.sessionStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};
const { previewRequest: request } = await import(
  pathToFileURL(path.join(directory, "services/preview.mjs")).href
);
const call = (route, body, method = "POST") =>
  request(route, { method, body: JSON.stringify(body) });
test("saved profile survives separate requests", async () => {
  values.clear();
  const profile = await request("profile", {});
  await call("profile", { ...profile, name: "Teste funcional" }, "PUT");
  assert.equal((await request("profile", {})).name, "Teste funcional");
});
test("checkout creates separate orders and preserves selected restaurant and amount", async () => {
  values.clear();
  const catalog = await request("catalog", {});
  const product = catalog.products.find(
    (p) => p.restaurant_id === "forno-italia",
  );
  const item = {
    key: "forno",
    product,
    quantity: 1,
    size: "Média",
    crust: "Tradicional",
    extras: [],
    note: "",
    unitPrice: product.price,
  };
  const body = {
    items: [item],
    address: "Endereço fictício de teste",
    payment: "PIX",
    coupon: "PIZZA10",
  };
  const one = await call("orders", body);
  const two = await call("orders", body);
  assert.notEqual(one.id, two.id);
  assert.equal(one.total, 58.01);
  assert.equal(one.restaurant_id, "forno-italia");
  assert.ok((await request("orders", {})).some((o) => o.id === one.id));
  assert.ok(
    !(await request("orders?scope=restaurant", {})).some(
      (o) => o.id === one.id,
    ),
  );
});
test("saved product edits persist and order status advances without skipping", async () => {
  values.clear();
  const catalog = await request("catalog", {});
  const pizza = catalog.products.find((p) => p.id === "calabresa");
  await call("products", { ...pizza, price: 55.9 });
  assert.equal(
    (await request("catalog", {})).products.find((p) => p.id === "calabresa")
      .price,
    55.9,
  );
  const order = (await request("orders?scope=restaurant", {})).find(
    (o) => o.status === "new",
  );
  await assert.rejects(() =>
    call("orders", { id: order.id, status: "delivered" }, "PATCH"),
  );
  await call("orders", { id: order.id, status: "preparing" }, "PATCH");
  assert.equal(
    (await request("orders", {})).find((o) => o.id === order.id).status,
    "preparing",
  );
});
