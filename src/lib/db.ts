import { neon } from "@neondatabase/serverless";
import { DatabaseConfigError } from "./database-errors";

export function db() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new DatabaseConfigError(
      "Configure DATABASE_URL em .env ou .env.local e reinicie o servidor.",
    );
  }

  return neon(connectionString);
}
