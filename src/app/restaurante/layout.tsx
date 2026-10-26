import Link from "@/components/ui/AppLink";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireUser } from "@/lib/auth";
import { owner } from "@/lib/server";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/restaurante");
  try {
    await owner();
  } catch {
    return (
      <div className="empty">
        <h1>Acesso restrito</h1>
        <p>Este painel pertence ao proprietário do restaurante.</p>
        <Link href="/" className="btn">
          Voltar ao delivery
        </Link>
      </div>
    );
  }
  return <AdminLayout>{children}</AdminLayout>;
}
