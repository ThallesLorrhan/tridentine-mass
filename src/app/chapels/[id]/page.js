"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchChapelById } from "@/lib/api";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ChapelPage() {
  const { id } = useParams();
  const [chapel, setChapel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchChapelById(id)
      .then((data) => setChapel(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (!chapel) return <p className="p-4 text-center">Chapel not found.</p>;

  const schedule = chapel.masses?.reduce((acc, m) => {
    const day = m.day_of_week_display.toLowerCase();
    if (!acc[day]) acc[day] = [];
    acc[day].push({ time: m.time, type: m.mass_type_display });
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 p-4 w-[95%] mx-auto">
      <div className="flex justify-center items-center gap-4 sm:flex-row lg:w-full">
        <Link
          href={"/home"}
          className="w-12 text-[#800020] lg:text-left"
          aria-label="Voltar"
        >
          <ChevronLeftIcon />
        </Link>
        <Image src="/chapel.png" width={80} height={0} alt="Imagem da capela" />

        <h1 className="font-[Italianno] text-3xl text-[#800020] mb-2 text-center drop-shadow-lg ">
          {chapel.name}
        </h1>
      </div>

      {/* <div className="flex flex-col items-left mt-5">
        <h2 className="text-xl text-[#800020]">Nome</h2>
        <p className="mt-5 text-left text-sm ">{chapel.name}</p>
      </div>

      <div className="border-t border-gray-300" /> */}

      <div className="flex flex-col items-left">
        <h2 className="text-xl text-[#800020]">Endereço</h2>
        {/* add street name */}
        {(chapel.address || chapel.city || chapel.state || chapel.country) && (
          <p className="mt-5 text-left text-sm">
            {[chapel.address, chapel.city, chapel.state, chapel.country]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </div>

      <div className="border-t border-gray-300" />

      <div className="flex flex-col">
        <h2 className="text-xl text-[#800020]">Horário das Missas</h2>
        <div className="mt-5">
          {schedule && Object.keys(schedule).length > 0 ? (
            Object.entries(schedule).map(([day, daySchedule]) => (
              <p key={day} className="text-left text-sm">
                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                {daySchedule.length > 0
                  ? daySchedule
                      .map((s) => {
                        const [hour, min] = s.time.split(":");
                        const h = hour.padStart(2, "0");
                        const m = min || "00";
                        return `${h}:${m} (${s.type})`;
                      })
                      .join(" | ")
                  : "Sem Missa"}
              </p>
            ))
          ) : (
            <p className="text-gray-500">Sem horários cadastrados.</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300" />

      <div className="flex flex-col items-left">
        <h2 className="text-xl text-[#800020]">Telefone</h2>
        {chapel.contact_phone && (
          <p className="mt-5 text-left text-sm">{chapel.contact_phone}</p>
        )}
      </div>

      <div className="border-t border-gray-300" />

      <div className="flex flex-col items-left">
        <h2 className="text-xl text-[#800020]">E-mail</h2>
        {chapel.contact_email && (
          <p className="mt-5 text-left text-sm">{chapel.contact_email}</p>
        )}
      </div>

      <div className="border-t border-gray-300" />

      <div className="flex flex-col items-left">
        <h2 className="text-xl text-[#800020]">Site</h2>
        {chapel.website && (
          <p className="mt-5 text-left text-sm">
            <a
              href={chapel.website}
              target="_blank"
              className="text-blue-600 underline"
            >
              {chapel.website}
            </a>
          </p>
        )}
      </div>

      <div className="border-t border-gray-300" />

      <div className="border-t border-gray-300" />

      <div className="flex flex-col">
        <h2 className="text-xl text-[#800020]">Responsável</h2>
        {chapel.responsibles?.map((r) => (
          <p key={r.id} className="text-sm mt-5">
            <strong>{r.name}</strong> {r.role && `(${r.role})`}
            <br />
            {r.phone && ` Phone: ${r.phone}`}
            <br />
            {r.email && ` Email: ${r.email}`}
          </p>
        ))}
      </div>

      <div className="border-t border-gray-300" />

      <div className="flex flex-col">
        <h2 className="text-xl text-[#800020]">Grupo Celebrante</h2>
        <p className="mt-5 text-sm ">FSSPX</p>
      </div>

      <div className="border-t border-gray-300" />

      <div className="mt-5">
        <h2 className="text-xl text-[#800020]">Fotos</h2>
        {chapel.images?.map((img) => (
          <div
            key={img.id}
            className="mt-5 w-full max-w-[600px] mx-auto overflow-hidden rounded-lg shadow"
          >
            <Image
              src={img.image}
              alt={img.caption || chapel.name}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300" />

      <button
        className="flex-1 bg-[#800020]/80 text-white px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] transition pointer-events-auto"
        onClick={() => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${chapel.latitude},${chapel.longitude}`;
          window.open(url, "_blank");
        }}
      >
        Ver Rotas no Google Maps
      </button>
    </div>
  );
}
