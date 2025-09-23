import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { fetchChapels } from "@/lib/api";
import ChapelPopup from "@/components/ChapelPopup"; // ✅ correção aqui

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

export default function ChapelMap() {
  const [L, setL] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [chapels, setChapels] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const Leaflet = require("leaflet");
      setL(Leaflet);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
          (err) => console.error("Error getting location:", err),
          { enableHighAccuracy: true }
        );
      }

      fetchChapels()
        .then((data) => {
          const formatted = data.map((c) => ({
            id: c.id,
            name: c.name,
            position: [parseFloat(c.latitude), parseFloat(c.longitude)],
            schedule: c.masses.reduce(
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
            ),
          }));
          setChapels(formatted);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  if (!L) return null;

  const churchIcon = new L.DivIcon({
    html: `<div class="bg-white border-2 border-blue-600 rounded-full p-1.5 flex justify-center items-center shadow-md">
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
    html: `<div class="bg-blue-600 border-2 border-white rounded-full w-4 h-4 shadow-sm"></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <MapContainer
      center={userLocation || [-22.9083, -43.1964]}
      zoom={12}
      className="h-screen w-full"
      key={userLocation ? userLocation.join(",") : "default"}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {chapels.map((chapel) => (
        <Marker key={chapel.id} position={chapel.position} icon={churchIcon}>
          <Popup>
            <ChapelPopup chapel={chapel} /> {/* ✅ usa o componente correto */}
          </Popup>
        </Marker>
      ))}

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <strong>You are here!</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
