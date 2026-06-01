"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MapSelector = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-60 w-full animate-pulse rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 dark:bg-gray-800">
      Memuat Peta...
    </div>
  ),
});

export function DialogAddLocation() {
  const [open, setOpen] = useState(false);
  const [namaWilayah, setNamaWilayah] = useState("");
  const [latitude, setLatitude] = useState("-6.4833"); 
  const [longitude, setLongitude] = useState("106.8500");
  const [radius, setRadius] = useState("5"); 

  const handleLocationSelect = (lat: string, lng: string) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      nama_daerah: namaWilayah,
      lat_pusat: parseFloat(latitude),
      long_pusat: parseFloat(longitude),
      radius_km: parseInt(radius)
    };

    console.log("Data Wilayah Baru:", payload);
    
    setNamaWilayah("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button className="h-10 rounded-full bg-emerald-600 px-6 font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <MapPin className="mr-2 h-4 w-4" />
          Tambah Wilayah Baru
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl h-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Tambah Master Wilayah
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tentukan koordinat tengah kecamatan untuk pembatasan wilayah laporan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Nama Wilayah / Kecamatan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kecamatan Cibinong"
              value={namaWilayah}
              onChange={(e) => setNamaWilayah(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-gray-800 dark:focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Pilih Titik Pusat Administrasi Daerah
            </label>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
              <MapSelector 
                defaultLat={latitude} 
                defaultLng={longitude} 
                onSelectLocation={handleLocationSelect} 
              />
            </div>
          </div>
          

          <DialogFooter className="mt-6 gap-2 sm:gap-0 border-t border-gray-100 pt-4 dark:border-gray-800 dark:bg-gray-900">
            <DialogClose >
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-gray-200 font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Simpan Wilayah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}