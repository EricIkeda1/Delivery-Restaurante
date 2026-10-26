import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = ts.transpileModule(
  readFileSync(new URL("../src/lib/cart.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  },
).outputText;
const { itemPrice, totals } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
const product = { price: 52.9 };
test("price includes selected size and allowed extras", () => {
  assert.equal(
    itemPrice(product, "Grande", ["Queijo extra", "Cebola extra"]),
    71.9,
  );
  assert.equal(itemPrice(product, "Pequena", []), 42.9);
});
test("coupon discounts only products, delivery stays separate", () => {
  const result = totals([{ unitPrice: 52.9, quantity: 2 }], 6, "PIZZA10");
  assert.equal(result.subtotal, 105.8);
  assert.equal(result.discount, 10.58);
  assert.equal(Math.round(result.total * 100), 10122);
});
test("empty cart does not charge delivery", () => {
  assert.deepEqual(totals([], 6, ""), {
    subtotal: 0,
    discount: 0,
    fee: 0,
    total: 0,
  });
});
test("unknown coupon never discounts", () => {
  assert.equal(
    totals([{ unitPrice: 49.9, quantity: 1 }], 6, "FAKE").discount,
    0,
  );
});
const { addCartItem, changeCartQuantity, isCartItem } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
const item = {
  key: "one",
  product: {
    id: "pizza",
    restaurant_id: "store-a",
    name: "Pizza",
    image: "/assets/pizza.jpg",
    price: 10,
  },
  quantity: 18,
  size: "Média",
  crust: "Tradicional",
  extras: [],
  note: "",
  unitPrice: 10,
};
test("repeated additions respect the API quantity limit", () => {
  assert.equal(addCartItem([item], { ...item, quantity: 5 })[0].quantity, 20);
});
test("switching restaurant starts a coherent single-store bag", () => {
  const next = {
    ...item,
    key: "two",
    product: { ...item.product, restaurant_id: "store-b" },
    quantity: 1,
  };
  assert.deepEqual(addCartItem([item], next), [next]);
});
test("quantity changes remove an item at zero", () => {
  assert.deepEqual(
    changeCartQuantity([{ ...item, quantity: 1 }], "one", -1),
    [],
  );
});
test("totals use exact integer cents for fractional prices", () => {
  assert.deepEqual(totals([{ unitPrice: 58.9, quantity: 1 }], 5, "PIZZA10"), {
    subtotal: 58.9,
    discount: 5.89,
    fee: 5,
    total: 58.01,
  });
});
test("invalid persisted cart records do not enter the UI", () => {
  assert.equal(isCartItem(item), true);
  assert.equal(isCartItem({ key: "broken" }), false);
  assert.equal(isCartItem({ ...item, quantity: 21 }), false);
});
