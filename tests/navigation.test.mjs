import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
const source = ts.transpileModule(
  fs.readFileSync("src/lib/screens.ts", "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  },
).outputText;
const { previewHref } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
test("main menu maps all three destinations separately", () => {
  assert.equal(previewHref("/"), "/previa/inicio");
  assert.equal(previewHref("/buscar"), "/previa/buscar");
  assert.equal(previewHref("/pedidos"), "/previa/pedidos");
});
test("restaurant, product and editor links keep the selected ID", () => {
  assert.equal(
    previewHref("/loja/forno-italia"),
    "/previa/cardapio?id=forno-italia",
  );
  assert.equal(previewHref("/produto/frango"), "/previa/produto?id=frango");
  assert.equal(
    previewHref("/restaurante/cardapio/novo/editar"),
    "/previa/editar-produto?id=novo",
  );
});
test("checkout confirmation keeps its own order and search retains query", () => {
  assert.equal(
    previewHref("/pedido/abc/confirmado"),
    "/previa/confirmado?id=abc",
  );
  assert.equal(previewHref("/buscar?q=pizza"), "/previa/buscar?q=pizza");
});
test("external URLs, auth and existing preview destinations stay unchanged", () => {
  for (const href of [
    "https://example.com",
    "//example.com",
    "/signin-with-chatgpt?return_to=%2F",
    "/previa/pedidos",
    "/interfaces",
  ])
    assert.equal(previewHref(href), href);
});
