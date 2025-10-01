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

export default function ChapelMap() {
  const [chapels, setChapels] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedChapel, setSelectedChapel] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation({ lat: -22.9083, lng: -43.1964 }),
        { enableHighAccuracy: true }
      );
    } else {
      setUserLocation({ lat: -22.9083, lng: -43.1964 });
    }
  }, []);

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

  const handleMapClick = () => setSelectedChapel(null);

  return (
    <div className="relative w-full h-screen">
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
          gestureHandling: "greedy",
          minZoom: 10,
          maxZoom: 16,
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                pointerEvents: "auto",
                touchAction: "auto",
              }}
              onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
              onTouchStart={(e) => e.stopPropagation()} // mobile
            >
              <div className="translate-y-[-220px]">
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
