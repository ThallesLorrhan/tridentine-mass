"use client";

import dynamic from "next/dynamic";
import SideButtons from "@/components/SideButtons";

// Importa o Map só no cliente
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col h-screen relative">
      <Map />

      {/* SideButtons sobre o mapa */}
      {/* <div className="absolute top-600 right-4 z-50">
        <SideButtons />
      </div> */}
    </main>
  );
}
