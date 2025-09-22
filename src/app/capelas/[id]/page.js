"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

const capelas = [
  {
    id: "1",
    nome: "Capela São José",
    endereco: "Rua Exemplo, 123, Niterói - RJ",
    horarios: {
      domingo: [
        { hora: "08:00", tipo: "Rezada" },
        { hora: "17:00", tipo: "Cantada" },
      ],
      segunda: [{ hora: "18:00", tipo: "Rezada" }],
      terca: [{ hora: "07:00", tipo: "Rezada" }],
      quarta: [],
      quinta: [{ hora: "12:00", tipo: "Rezada" }],
      sexta: [{ hora: "07:00", tipo: "Rezada" }],
      sabado: [{ hora: "09:00", tipo: "Rezada" }],
    },
    position: [-22.9083, -43.1964],
    fotos: ["/images/capela1_1.jpg", "/images/capela1_2.jpg"],
  },
  {
    id: "2",
    nome: "Capela Nossa Senhora da Conceição",
    endereco: "Estrada Matapaca, 333, Niterói - RJ",
    horarios: {
      domingo: [
        { hora: "07:00", tipo: "Rezada" },
        { hora: "19:00", tipo: "Cantada" },
      ],
      segunda: [],
      terca: [{ hora: "08:00", tipo: "Rezada" }],
      quarta: [{ hora: "18:00", tipo: "Cantada" }],
      quinta: [
        { hora: "07:00", tipo: "Rezada" },
        { hora: "12:00", tipo: "Cantada" },
      ],
      sexta: [{ hora: "19:00", tipo: "Cantada" }],
      sabado: [{ hora: "09:00", tipo: "Rezada" }],
    },
    position: [-22.88655, -43.038011],
    fotos: ["/images/capela2_1.jpg", "/images/capela2_2.jpg"],
  },
];

export default function CapelaPage() {
  const params = useParams();
  const id = params.id;
  const capela = capelas.find((c) => c.id === id);

  if (!capela)
    return <p className="text-center mt-10">Capela não encontrada.</p>;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{capela.nome}</h1>
      <p className="mb-4">{capela.endereco}</p>

      <h2 className="font-semibold mt-6 mb-2">Horários das Missas:</h2>
      <ul className="list-disc list-inside">
        {Object.entries(capela.horarios).map(([dia, horariosDia]) => (
          <li key={dia}>
            <span className="font-semibold">
              {dia.charAt(0).toUpperCase() + dia.slice(1)}:
            </span>{" "}
            {horariosDia.length > 0
              ? horariosDia.map((h, i) => (
                  <span key={i}>
                    {h.hora} ({h.tipo}){i < horariosDia.length - 1 ? " | " : ""}
                  </span>
                ))
              : "Sem missa"}
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mt-6 mb-2">Fotos:</h2>
      <div className="flex flex-wrap gap-3">
        {capela.fotos.map((foto, index) => (
          <Image
            key={index}
            src={foto}
            alt={`${capela.nome} foto ${index + 1}`}
            width={250}
            height={200}
            className="rounded-lg object-cover"
          />
        ))}
      </div>

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        onClick={() => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${capela.position[0]},${capela.position[1]}`;
          window.open(url, "_blank");
        }}
      >
        Traçar Rota
      </button>
    </div>
  );
}
