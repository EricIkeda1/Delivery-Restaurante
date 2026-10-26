"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function PreviewBoundary({ children }: { children: ReactNode }) {
  const preview = usePathname().startsWith("/previa/");
  return (
    <div className={preview ? "preview-mode" : undefined}>
      {preview && (
        <div className="preview-notice">
          Demonstração interativa • Dados de exemplo, separados do banco{" "}
          <a href="/interfaces" target="_top">
            Todas as telas
          </a>
        </div>
      )}
      {children}
    </div>
  );
}
