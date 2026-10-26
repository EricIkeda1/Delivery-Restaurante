import { OrderDetailsPage } from "@/views/admin/OrderDetailsPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <OrderDetailsPage id={(await params).id} />;
}
