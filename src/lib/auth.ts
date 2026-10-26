import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return {
    userId: session.user.id,
    displayName: session.user.name || "Cliente",
    email: session.user.email || "",
  };
}

export async function requireUser(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?callbackUrl=" + encodeURIComponent(returnTo));
  return user;
}
