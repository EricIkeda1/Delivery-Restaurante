import { ProductPage } from "@/views/ProductPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductPage id={(await params).id} />;
}
