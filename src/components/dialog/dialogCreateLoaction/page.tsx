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
import { toast } from "sonner"; // Pastikan udah install sonner
import { createLocation, LocationPayload } from "@/lib/location"; // Sesuaikan path ini bray!

const MapSelector = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-60 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400 dark:bg-gray-800">
      Memuat Peta...
    </div>
  ),
});

export function DialogAddLocation() {
  const [open, setOpen] = useState(false);
  const [namaWilayah, setNamaWilayah] = useState("");
  const [latitude, setLatitude] = useState<number>(-6.4833);
  const [longitude, setLongitude] = useState<number>(106.85);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LocationPayload = {
      nama_lokasi: namaWilayah,
      latitude: latitude,
      longitude: longitude,
    };

    const createPromise = createLocation(payload).then((res) => {
      if (res && res.success === false) {
        throw new Error(res.message || "Gagal menyimpan wilayah");
      }

      setOpen(false);
      setNamaWilayah(""); // Reset nama wilayah

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return res;
    });

    toast.promise(
      createPromise,
      {
        loading: "Sedang menyimpan wilayah...",
        success: "Wilayah berhasil ditambahkan",
        error: (err) => err.message || "Gagal menambahkan wilayah",
      },
      {
        position: "top-right",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="h-10 rounded-full bg-emerald-600 px-6 font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <MapPin className="mr-2 h-4 w-4" />
          Tambah Wilayah Baru
        </Button>
      </DialogTrigger>

      <DialogContent className="h-full max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:max-w-lg sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Tambah Master Wilayah
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tentukan koordinat tengah kecamatan untuk pembatasan wilayah
            laporan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
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
                position={[latitude, longitude]}
                setPosition={(pos: [number, number]) => {
                  setLatitude(pos[0]);
                  setLongitude(pos[1]);
                }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-gray-400">
              Lat: {latitude.toFixed(6)} | Lng: {longitude.toFixed(6)}
            </p>
          </div>

          <DialogFooter className="mt-6 gap-2 border-t border-gray-100 pt-4 sm:gap-0 dark:border-gray-800 dark:bg-gray-900">
            <DialogClose>
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
