import { ScreenPreviewPage } from "@/views/ScreenPreviewPage";
export default async function Page({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  return <ScreenPreviewPage screen={(await params).screen} />;
}
