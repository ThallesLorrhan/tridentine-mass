"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Importa o componente Map só no cliente
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-6 px-6 text-center">
        <h1 className="text-4xl font-bold">Missas Tridentinas</h1>
        <p>Localize capelas que celebram a Missa tradicional</p>
      </section>

      <div className="flex-1">
        <Map />
      </div>
    </main>
  );
}
