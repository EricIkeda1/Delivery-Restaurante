import { Suspense } from "react";
import { CartPage } from "@/views/CartPage";
export default function Page() {
  return (
    <Suspense>
      <CartPage />
    </Suspense>
  );
}
