"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchChapelById } from "@/lib/api";
import Image from "next/image";

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

  // Formata o schedule
  const schedule = chapel.masses?.reduce(
    (acc, m) => {
      const day = m.day_of_week_display.toLowerCase();
      if (!acc[day]) acc[day] = [];
      acc[day].push({ time: m.time, type: m.mass_type_display });
      return acc;
    },
    {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    }
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col gap-6">
      {/* Nome da Capela */}
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        {chapel.name}
      </h1>

      {/* Endereço */}
      {(chapel.address || chapel.city || chapel.state || chapel.country) && (
        <p className="text-gray-700 text-center">
          <strong>Endereço</strong>{" "}
          {[chapel.address, chapel.city, chapel.state, chapel.country]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}

      {/* Contatos */}
      {(chapel.contact_phone || chapel.contact_email || chapel.website) && (
        <div className="flex flex-col items-center text-gray-700 gap-1">
          {chapel.contact_phone && (
            <p>
              <strong>Phone:</strong> {chapel.contact_phone}
            </p>
          )}
          {chapel.contact_email && (
            <p>
              <strong>Email:</strong> {chapel.contact_email}
            </p>
          )}
          {chapel.website && (
            <p>
              <strong>Website:</strong>{" "}
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
      )}

      {/* Descrição */}
      {chapel.description && (
        <p className="text-gray-800 text-justify bg-white p-4 rounded shadow">
          {chapel.description}
        </p>
      )}

      {/* Horários das missas */}
      {schedule && Object.keys(schedule).length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 ">
            Horário das Missas
          </h2>
          {Object.entries(schedule).map(([day, daySchedule]) => (
            <p key={day} className="text-gray-700">
              <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
              {daySchedule.length > 0
                ? daySchedule.map((s, i) => `${s.time} (${s.type})`).join(" | ")
                : "Sem Missa"}
            </p>
          ))}
        </div>
      )}

      {/* Responsáveis */}
      {chapel.responsibles?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Responsáveis
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {chapel.responsibles.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong> {r.role ? `(${r.role})` : ""}
                {r.phone && ` - Phone: ${r.phone}`}
                {r.email && ` - Email: ${r.email}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fotos */}
      {chapel.images?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Fotos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chapel.images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg shadow">
                <Image
                  src={img.image}
                  alt={img.caption || chapel.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de direções */}
      {chapel.latitude && chapel.longitude && (
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${chapel.latitude},${chapel.longitude}`;
            window.open(url, "_blank");
          }}
        >
          Ver Direções
        </button>
      )}
    </div>
  );
}
