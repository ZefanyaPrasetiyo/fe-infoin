"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// CSS Imports
// @ts-ignore
import "leaflet/dist/leaflet.css";
// @ts-ignore
import "leaflet-defaulticon-compatibility";
// @ts-ignore
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
// @ts-ignore
import "leaflet-geosearch/dist/geosearch.css";

const DEFAULT_CENTER: [number, number] = [-6.200000, 106.816666]; // Jakarta
const DEFAULT_ZOOM = 13;

interface MapReportProps {
  position: [number, number] | null;
  setPosition: (position: [number, number] | null) => void;
  zoom?: number;
}

// 1. Komponen untuk menangani klik pada peta
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// 2. Komponen untuk fitur pencarian (GeoSearch)
function MapSearchControl({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false, 
      showPopup: false,
      autoClose: true,
      searchLabel: "Cari lokasi atau alamat...",
    });

    map.addControl(searchControl);

    // Event saat lokasi ditemukan dari bar pencarian
    map.on("geosearch/showlocation", (result: any) => {
      const { y: lat, x: lng } = result.location;
      onLocationSelect(lat, lng);
      map.flyTo([lat, lng], 16); // Tambahan: Otomatis zoom & pindah ke lokasi yang dicari
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [map, onLocationSelect]);

  return null;
}

// 3. Komponen tombol "Lokasi Saya" (Geolocation)
function LocateMeButton({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleLocationFound = (e: any) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    };

    map.on("locationfound", handleLocationFound);
    
    return () => {
      map.off("locationfound", handleLocationFound);
    };
  }, [map, onLocationSelect]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: "10px", marginRight: "10px", pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={() => map.locate({ setView: true, maxZoom: 16 })}
        className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-md hover:bg-slate-50 transition-colors"
      >
       Lokasi Saya
      </button>
    </div>
  );
}

// Komponen Utama
export default function MapReport({ position, setPosition, zoom = DEFAULT_ZOOM }: MapReportProps) {
  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
  };

  return (
    <MapContainer 
      center={position || DEFAULT_CENTER} 
      zoom={zoom} 
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Kontrol & Interaksi Peta */}
      <MapSearchControl onLocationSelect={handleLocationSelect} />
      <LocateMeButton onLocationSelect={handleLocationSelect} />
      <MapClickHandler onLocationSelect={handleLocationSelect} />

      {/* Marker Lokasi Terpilih */}
      {position && (
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <strong>Lokasi Laporan</strong><br /> 
              Lat: {position[0].toFixed(6)}<br />
              Lng: {position[1].toFixed(6)}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}