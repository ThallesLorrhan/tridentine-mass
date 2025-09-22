"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Map() {
  const [L, setL] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  const [capelas] = useState([
    {
      id: 1,
      nome: "Capela São José",
      horarios: {
        domingo: [
          { hora: "08:00", tipo: "Rezada" },
          { hora: "17:00", tipo: "Cantada" },
        ],
        segunda: [{ hora: "18:00", tipo: "Rezada" }],
        terca: [
          { hora: "07:00", tipo: "Rezada" },
          { hora: "19:00", tipo: "Cantada" },
        ],
        quarta: [],
        quinta: [{ hora: "12:00", tipo: "Rezada" }],
        sexta: [
          { hora: "07:00", tipo: "Rezada" },
          { hora: "18:00", tipo: "Cantada" },
        ],
        sabado: [
          { hora: "09:00", tipo: "Rezada" },
          { hora: "19:00", tipo: "Cantada" },
        ],
      },
      position: [-22.9083, -43.1964],
    },
    {
      id: 2,
      nome: "Capela Nossa Senhora da Conceição",
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
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const Leaflet = require("leaflet");
      setL(Leaflet);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserPosition([
              position.coords.latitude,
              position.coords.longitude,
            ]);
          },
          (err) => console.error("Erro ao obter localização:", err),
          { enableHighAccuracy: true }
        );
      }
    }
  }, []);

  if (!L) return null;

  const churchIcon = new L.DivIcon({
    html: `
      <div style="
        background:#fff; 
        border:2px solid #2563eb; 
        border-radius:50%; 
        padding:6px; 
        display:flex; 
        justify-content:center; 
        align-items:center;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#2563eb" viewBox="0 0 24 24" width="28" height="28">
          <path d="M12 2L15 6H13V10H11V6H9L12 2ZM6 22V12H4L12 4L20 12H18V22H14V16H10V22H6Z"/>
        </svg>
      </div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const userIcon = new L.DivIcon({
    html: `<div style="
      background:#2563eb;
      border:2px solid #fff;
      border-radius:50%;
      width:16px;
      height:16px;
      box-shadow:0 0 4px rgba(0,0,0,0.5);
    "></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <MapContainer
      center={userPosition || [-22.9083, -43.1964]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
      key={userPosition ? userPosition.join(",") : "default"}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {capelas.map((capela) => (
        <Marker key={capela.id} position={capela.position} icon={churchIcon}>
          <Popup>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {capela.nome}
              </h3>
              <div style={{ textAlign: "left" }}>
                {Object.entries(capela.horarios).map(([dia, horariosDia]) => (
                  <p key={dia}>
                    <strong>
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}:
                    </strong>{" "}
                    {horariosDia.length > 0
                      ? horariosDia.map((h, i) => (
                          <span key={i}>
                            {h.hora} ({h.tipo})
                            {i < horariosDia.length - 1 ? " | " : ""}
                          </span>
                        ))
                      : "Sem missa"}
                  </p>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2 mt-2 w-full">
                <Link href={`/capelas/${capela.id}`} className="w-full">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
                    Mais informações
                  </button>
                </Link>
                <button
                  className="w-full bg-grey-200  text-black px-4 py-2 rounded font-medium"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${capela.position[0]},${capela.position[1]}`;
                    window.open(url, "_blank");
                  }}
                >
                  Traçar Rota
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>
            <div style={{ textAlign: "center" }}>
              <strong>Você está aqui!</strong>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
