import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { neon } from "@neondatabase/serverless";

const fileValues = {};
for (const file of [".env", ".env.local"]) {
  if (existsSync(file))
    Object.assign(fileValues, parseEnv(readFileSync(file, "utf8")));
}
const connectionString = process.env.DATABASE_URL || fileValues.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL não foi configurada em .env ou .env.local.");
  process.exit(1);
}

try {
  const sql = neon(connectionString);
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  const expected = [
    "restaurants",
    "products",
    "profiles",
    "store_settings",
    "orders",
  ];
  const missing = expected.filter(
    (name) => !tables.some((table) => table.table_name === name),
  );
  if (missing.length) {
    console.error("Conexão OK. Faltam tabelas:", missing.join(", "));
    console.error(
      "Execute database/schema.sql e database/seed.sql no SQL Editor do mesmo banco Neon.",
    );
    process.exitCode = 1;
  } else {
    const [row] = await sql`SELECT
      (SELECT count(*) FROM restaurants) AS restaurants,
      (SELECT count(*) FROM products) AS products`;
    console.log("Conexão OK. Tabelas encontradas.");
    console.log("Restaurantes:", row.restaurants, "Produtos:", row.products);
    if (Number(row.restaurants) === 0)
      console.log(
        "Execute database/seed.sql para carregar o catálogo inicial.",
      );
  }
} catch (error) {
  const code =
    typeof error?.code === "string" ? error.code : "CONNECTION_ERROR";
  console.error("Falha ao verificar o banco. Código:", code);
  console.error(
    "Confira a conexão em DATABASE_URL e a disponibilidade do banco no Neon.",
  );
  process.exitCode = 1;
}
