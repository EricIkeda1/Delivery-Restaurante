import { neon } from "@neondatabase/serverless";

export function db() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Configure DATABASE_URL para conectar ao Neon.");
  }

  return neon(connectionString);
}
