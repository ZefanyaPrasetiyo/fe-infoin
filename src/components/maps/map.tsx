"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// @ts-ignore
import "leaflet/dist/leaflet.css";
// @ts-ignore
import "leaflet-defaulticon-compatibility";
// @ts-ignore
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
// @ts-ignore
import "leaflet-geosearch/dist/geosearch.css"; // <-- CSS wajib buat kotak search

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapControls({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar",
      showMarker: false, // Dimatikan karena kita pakai <Marker> bawaan kita sendiri
      showPopup: false,
      autoClose: true,
      searchLabel: "Cari lokasi atau alamat...",
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result: any) => {
      onLocationSelect(result.location.y, result.location.x);
    });

    map.on("locationfound", (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
      map.off("locationfound");
    };
  }, [map, onLocationSelect]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: "10px", marginRight: "10px", pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={() => map.locate({ setView: true, maxZoom: 16 })}
        className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-md hover:bg-slate-50"
      >
       Lokasi Saya
      </button>
    </div>
  );
}

export default function MapReport(props: any) {
  const { position, setPosition, zoom = 13 } = props;

  const handleLocationSelect = (lat: number, lng: number) => {
    if (setPosition) {
      setPosition([lat, lng]);
    }
  };

  return (
    <MapContainer 
      center={position || [-6.200000, 106.816666]} 
      zoom={zoom} 
      scrollWheelZoom={false} 
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapControls onLocationSelect={handleLocationSelect} />
      <MapClickHandler onLocationSelect={handleLocationSelect} />

      {position && (
        <Marker position={position}>
          <Popup>
            Lokasi Laporan <br /> 
            Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}