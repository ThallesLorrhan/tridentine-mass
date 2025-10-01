"use client";

import dynamic from "next/dynamic";
import SideButtons from "@/components/SideButtons";

// Importa o Map só no cliente
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <main className="flex h-screen ">
      <Map />
    </main>
  );
}
