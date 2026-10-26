import { ConfirmationPage } from "@/views/ConfirmationPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ConfirmationPage id={(await params).id} />;
}
