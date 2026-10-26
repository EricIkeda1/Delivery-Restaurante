export class DatabaseConfigError extends Error {}

export function databaseErrorMessage(error: unknown): string | null {
  if (error instanceof DatabaseConfigError) return error.message;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";

  if (code === "42P01")
    return "Faltam tabelas no banco. Execute database/schema.sql e database/seed.sql no Neon.";
  if (code === "28P01")
    return "A conexão do Neon foi recusada. Confira o usuário e a senha em DATABASE_URL e reinicie o servidor.";
  if (code === "3D000")
    return "O banco informado em DATABASE_URL não existe. Confira o nome do banco no Neon.";
  return null;
}
