"use client";

import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import SideButtons from "@/components/SideButtons";
import { fetchChapels } from "@/lib/api";
import ChapelPopup from "@/components/ChapelPopup";
import SearchBar from "./SearchBar";

export default function ChapelMap() {
  const [chapels, setChapels] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedChapel, setSelectedChapel] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Pegar localização do usuário apenas uma vez
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation({ lat: -22.9083, lng: -43.1964 }), // fallback
        { enableHighAccuracy: true }
      );
    } else {
      setUserLocation({ lat: -22.9083, lng: -43.1964 }); // fallback
    }
  }, []);

  // Buscar capelas
  useEffect(() => {
    fetchChapels()
      .then((data) => {
        const formatted = data.map((c) => {
          const schedule = c.masses?.reduce(
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

          return {
            id: c.id,
            name: c.name,
            position: {
              lat: parseFloat(c.latitude),
              lng: parseFloat(c.longitude),
            },
            schedule,
            raw: { ...c, schedule },
          };
        });
        setChapels(formatted);
      })
      .catch(console.error);
  }, []);

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando mapa...
      </div>
    );

  const chapelIcon = {
    url: "/mark2.png",
    scaledSize: new window.google.maps.Size(50, 50),
    anchor: new window.google.maps.Point(25, 50),
  };

  const userIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#fff",
  };

  // Fecha popup ao clicar fora
  const handleMapClick = () => setSelectedChapel(null);

  return (
    <div className="relative w-full h-screen">
      <SearchBar />

      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={userLocation || { lat: -22.9083, lng: -43.1964 }}
        zoom={12}
        onLoad={(map) => (mapRef.current = map)}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
          rotateControl: false,
          clickableIcons: false,
          keyboardShortcuts: false,
          scaleControl: false,
          gestureHandling: "greedy", // permite um dedo no mobile
        }}
      >
        {chapels.map((chapel) => (
          <Marker
            key={chapel.id}
            position={chapel.position}
            onClick={(e) => {
              e.domEvent.stopPropagation();
              setSelectedChapel(chapel);
            }}
            icon={chapelIcon}
          />
        ))}

        {selectedChapel && mapRef.current && (
          <OverlayView
            position={selectedChapel.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            map={mapRef.current}
          >
            <div className="flex justify-center pointer-events-auto -translate-y-full">
              <div
                className="translate-y-[-50px]"
                onClick={(e) => e.stopPropagation()} // previne fechar ao clicar dentro
                style={{ touchAction: "auto" }} // permite interações no mobile
              >
                <ChapelPopup chapel={selectedChapel.raw} />
              </div>
            </div>
          </OverlayView>
        )}

        {userLocation && <Marker position={userLocation} icon={userIcon} />}
      </GoogleMap>

      <div className="absolute top-[550px] right-2 z-50">
        <SideButtons
          onCenterUser={() => {
            if (mapRef.current && userLocation) {
              mapRef.current.panTo(userLocation);
              mapRef.current.setZoom(14);
            } else {
              console.warn("Mapa ou localização do usuário não disponível");
            }
          }}
        />
      </div>
    </div>
  );
}
