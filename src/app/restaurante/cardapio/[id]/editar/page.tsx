import { EditProductPage } from "@/views/admin/EditProductPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditProductPage id={(await params).id} />;
}
