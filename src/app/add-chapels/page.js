"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AddChapel from "@/components/AddChapel ";

export default function AddChapelPage() {
  return (
    <div>
      <Suspense
        fallback={<div>Carregando o formulário e dados de localização...</div>}
      >
        <AddChapel />
      </Suspense>
    </div>
  );
}
