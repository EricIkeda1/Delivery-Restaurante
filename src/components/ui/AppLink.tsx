"use client";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";
import { previewHref } from "@/lib/screens";
/** Native links keep every route usable through direct navigation and reloads. */
export default function AppLink({
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const path = usePathname();
  const target =
    path.startsWith("/previa/") && href.startsWith("/")
      ? previewHref(href)
      : href;
  return <a {...props} href={target} />;
}
