// ChapelPopup.js
import React from "react";
import Link from "next/link";

export default function ChapelPopup({ chapel }) {
  if (!chapel) return null;

  // Ajuste para pegar os horários
  const daysWithMass = chapel.schedule
    ? Object.entries(chapel.schedule).filter(
        ([_, daySchedule]) => daySchedule.length > 0
      )
    : [];

  // Ajuste para posição da capela
  const lat =
    chapel.position?.lat || (chapel.position ? chapel.position[0] : 0);
  const lng =
    chapel.position?.lng || (chapel.position ? chapel.position[1] : 0);

  return (
    <div
      style={{ minWidth: "200px", maxWidth: "300px" }}
      className="bg-white/90 flex flex-col p-3 rounded-3xl shadow-lg border border-[#800020]"
    >
      {/* Título */}
      <h3 className="font-[Italianno] text-2xl text-[#800020] mb-2 text-center">
        {chapel.name}
      </h3>

      {/* Horários */}
      <div className="text-sm mb-3 space-y-1 text-gray-700">
        {daysWithMass.length > 0 ? (
          daysWithMass.map(([day, daySchedule]) => (
            <p key={day}>
              <span className="capitalize font-medium">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>
              {": "}
              {daySchedule
                .map((s) => `${s.time.slice(0, 5)} (${s.type})`)
                .join(", ")}
            </p>
          ))
        ) : (
          <p>Sem Missa</p>
        )}
      </div>

      {/* Botões */}
      <div className="flex justify-between gap-2">
        <Link
          href={`/chapels/${chapel.id}`}
          className="flex-1 bg-[#800020]/80 px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] text-white text-center no-underline transition"
        >
          Informações
        </Link>

        <button
          className="flex-1 bg-[#800020]/80 text-white px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] transition"
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${chapel.latitude},${chapel.longitude}`;
            window.open(url, "_blank");
          }}
        >
          Rotas
        </button>
      </div>
    </div>
  );
}
