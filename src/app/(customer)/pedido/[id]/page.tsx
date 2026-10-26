import { Suspense } from "react";
import { TrackingPage } from "@/views/TrackingPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <TrackingPage id={id} />
    </Suspense>
  );
}
