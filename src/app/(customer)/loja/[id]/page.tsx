import { RestaurantPage } from "@/views/RestaurantPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RestaurantPage id={id} />;
}
