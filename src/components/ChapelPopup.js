import React from "react";
import Link from "next/link";

export default function ChapelPopup({ chapel }) {
  if (!chapel) return null;

  // Filtra apenas os dias que têm pelo menos uma missa
  const daysWithMass = chapel.schedule
    ? Object.entries(chapel.schedule).filter(
        ([_, daySchedule]) => daySchedule.length > 0
      )
    : [];

  return (
    <div className="bg-white flex flex-col p-4 rounded shadow max-w-xs">
      <h3 className="font-bold mb-2 text-lg">{chapel.name}</h3>

      <div className="text-left text-sm mb-2">
        {daysWithMass.length > 0 ? (
          daysWithMass.map(([day, daySchedule]) => (
            <p key={day}>
              <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
              {daySchedule.map((s, i) => `${s.time} (${s.type})`).join(" | ")}
            </p>
          ))
        ) : (
          <p>No Mass</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* Botão para a página de informação */}
        <Link href={`/chapels/${chapel.id}`}>
          <div className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
            Informações
          </div>
        </Link>

        {/* Botão de rotas */}
        <button
          className="w-full bg-gray-200 text-black px-4 py-2 rounded font-medium"
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${chapel.position[0]},${chapel.position[1]}`;
            window.open(url, "_blank");
          }}
        >
          Direções
        </button>
      </div>
    </div>
  );
}
