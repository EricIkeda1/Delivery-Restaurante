"use client";
import Link from "@/components/ui/AppLink";
import { ArrowLeft } from "lucide-react";
import { FoodDiscovery } from "@/components/restaurant/FoodDiscovery";
export function FoodImportPage() {
  return (
    <>
      <Link className="back-link" href="/restaurante/cardapio">
        <ArrowLeft size={16} />
        Voltar ao cardápio
      </Link>
      <FoodDiscovery importMode />
    </>
  );
}
