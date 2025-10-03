"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SideButtons({ onCompass, onCenterUser, onAddPage }) {
  const router = useRouter();

  return (
    <div className="absolute z-50 right-2 top-1/2 flex flex-col gap-3 -translate-y-1/2">
      {/* Botão Union - Ajustar bússola */}
      <button
        onClick={onCompass}
        className="w-12 h-12 bg-[#800020]/80 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition"
      >
        <Image
          src="/Union.png"
          alt="Compass"
          width={24}
          height={24}
          className="object-contain"
        />
      </button>

      {/* Botão Remap - Centralizar usuário */}
      <button
        onClick={onCenterUser}
        className="w-12 h-12 bg-[#800020]/80 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition"
      >
        <Image
          src="/reMap.png"
          alt="Center User"
          width={24}
          height={24}
          className="object-contain"
        />
      </button>

      {/* Botão Add - Ir para página */}
      <button
        onClick={() => router.push("/add-chapels")}
        className="w-12 h-12 bg-[#800020]/80 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition"
      >
        <Image
          src="/add.png"
          alt="Add Page"
          width={24}
          height={24}
          className="object-contain"
        />
      </button>
    </div>
  );
}
