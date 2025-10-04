"use client";

import { useState, useCallback, useEffect } from "react";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useGoogleMaps } from "@/context/GoogleMapsProvider";

const libraries = ["places"];
const defaultCenter = { lat: -23.55052, lng: -46.633308 };

export default function SearchMapPage() {
  const { isLoaded } = useGoogleMaps();

  const router = useRouter();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [addressData, setAddressData] = useState({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  const onLoadMap = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmountMap = useCallback(() => setMap(null), []);

  // Localização do usuário
  useEffect(() => {
    if (isLoaded && navigator.geolocation && map && !userMarker) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const userIcon = {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#fff",
          };

          setUserMarker({ position: { lat, lng }, icon: userIcon });
          map.panTo({ lat, lng });
          map.setZoom(15);
        },
        (err) => console.warn("Erro ao obter localização:", err)
      );
    }
  }, [isLoaded, map, userMarker]);

  const geocodeLatLng = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const components = results[0].address_components;
        const getComponent = (types) =>
          components.find((c) => types.every((t) => c.types.includes(t)))
            ?.long_name || "";

        const city =
          getComponent(["locality"]) ||
          getComponent(["administrative_area_level_2"]);

        setAddressData((prev) => ({
          ...prev,
          street: getComponent(["route"]),
          number: getComponent(["street_number"]),
          neighborhood:
            getComponent(["sublocality", "political"]) ||
            getComponent(["neighborhood"]),
          city,
          state: getComponent(["administrative_area_level_1"]),
          country: getComponent(["country"]),
          latitude: lat,
          longitude: lng,
        }));
      }
    });
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = place.geometry.location;

    geocodeLatLng(location.lat(), location.lng());
    setMarker({ lat: location.lat(), lng: location.lng() });
    map.panTo({ lat: location.lat(), lng: location.lng() });
    map.setZoom(17);
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    geocodeLatLng(lat, lng);
  };

  const handleConfirmLocation = () => {
    const params = new URLSearchParams();
    Object.entries(addressData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    router.push(`/add-chapels?${params.toString()}`);
  };

  if (!isLoaded)
    return <div className="flex justify-center items-center h-screen"></div>;

  return (
    <div className="relative w-full h-screen">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={defaultCenter}
        zoom={12}
        onLoad={onLoadMap}
        onUnmount={onUnmountMap}
        onClick={onMapClick}
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
        }}
      >
        {marker && <Marker position={marker} />}
        {userMarker && (
          <Marker position={userMarker.position} icon={userMarker.icon} />
        )}
      </GoogleMap>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleConfirmLocation}
          className="bg-[#800020]/80 text-white px-4 py-2 rounded-3xl text-md font-medium hover:bg-[#a00028] transition pointer-events-auto"
        >
          Confirmar Localização
        </button>
      </div>
    </div>
  );
}
