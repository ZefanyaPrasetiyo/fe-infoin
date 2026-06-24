"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, MapPin, X, Loader2, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getReports } from "@/lib/report";
import { getLocations } from "@/lib/location";
import Label from "../form/Label";
import { Input } from "../ui/input";

export default function UserReportsGrid() {
  const { data: session } = useSession();
  console.log("=================", session)
  const userRole = (session?.user as any)?.role || "user";
  const userId = session?.user?.id;
  const userLocationId = (session?.user as any)?.id_location;

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState<any | null>(null);
  
  const [locationName, setLocationName] = useState(userLocationId || "-");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === "user") {
          // Logika Warga: Fetch Laporan
          const res = await getReports();
          if (res.success) {
            const myApprovedReports = res.data.filter(
              (laporan: any) => 
                laporan.id_user === userId && 
                laporan.status === "disetujui"
            );
            setReports(myApprovedReports);
          } else {
            toast.error("Gagal memuat laporan Anda");
          }
        } else {
          // Logika Admin/Petugas: Fetch Mapping Lokasi buat form
          if (userLocationId) {
            const res = await getLocations();
            if (res.success) {
              // 🚨 FIX: Pastikan pakai String() biar id '1' (number) dan "1" (string) tetep match
              const loc = res.data.find((l: any) => String(l.id) === String(userLocationId));
              if (loc) {
                // 🚨 FIX: Handle berbagai kemungkinan key dari API backend lu
                setLocationName(loc.nama_lokasi || loc.nama || loc.name || userLocationId);
              } else {
                setLocationName(`Lokasi ID: ${userLocationId} (Tidak Ditemukan)`);
              }
            }
          } else {
            setLocationName("Belum Ada Lokasi");
          }
        }
      } catch (error) {
        toast.error("Terjadi kesalahan pada server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userRole, userLocationId]);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3 mt-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm font-normal">Memuat data profil...</p>
      </div>
    );
  }

  // 🚨 KONDISI 1: JIKA YANG LOGIN ADALAH ADMIN ATAU PETUGAS (NAMPILIN FORM)
  if (userRole === "admin" || userRole === "petugas") {
    return (
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111c2d]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <UserIcon className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Informasi Detail Akun
          </h3>
        </div>

        <form className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>Nama Lengkap</Label>
            <Input type="text" value={(session?.user as any)?.nama_panjang || ""} disabled className="bg-gray-50 opacity-70" />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Email Address</Label>
            <Input type="text" value={session?.user?.email || ""} disabled className="bg-gray-50 opacity-70" />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <Label>Wilayah Penugasan</Label>
            {/* 🚨 Sekarang harusnya lokasinya udah muncul namanya */}
            <Input type="text" value={locationName} disabled className="bg-gray-50 opacity-70" />
          </div>

          <div className="col-span-2 pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              * Data profil ini tidak dapat diubah oleh Anda. Jika ada ketidaksesuaian data atau perpindahan wilayah, silakan hubungi Administrator sistem (Master).
            </p>
          </div>
        </form>
      </div>
    );
  }

  // 🚨 KONDISI 2: JIKA YANG LOGIN ADALAH WARGA (NAMPILIN GRID POSTINGAN)
  return (
    <div className="mt-8 w-full">
      <div className="flex justify-center border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 border-t-2 border-gray-800 px-4 py-4 text-sm font-semibold tracking-widest text-gray-800 dark:border-white dark:text-white uppercase">
          <Camera className="h-4 w-4" />
          <span>Laporan Disetujui</span>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-800 dark:border-gray-400 mb-4">
            <Camera className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Belum Ada Postingan</h3>
          <p className="text-sm">Laporan yang disetujui akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {reports.map((laporan) => (
            <Card 
              key={laporan.id} 
              className="group cursor-pointer overflow-hidden rounded-none border-none shadow-none"
              onClick={() => setSelectedLaporan(laporan)}
            >
              <CardContent className="relative aspect-square w-full p-0">
                <Image
                  src={laporan.bukti_laporan?.[0] || "/images/ilustration/ilustrasi-laporan-1.jpeg"}
                  alt={laporan.judul_laporan || "Laporan"}
                  fill 
                  sizes="(max-width: 768px) 33vw, 30vw"
                  className="object-cover bg-slate-100 dark:bg-slate-800 transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white">
                    <span className="font-semibold drop-shadow-md text-center px-2 line-clamp-2">
                      {laporan.judul_laporan}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detail Pop-up Ala IG Post */}
      <Dialog open={!!selectedLaporan} onOpenChange={(open) => !open && setSelectedLaporan(null)}>
        <DialogContent className="w-full max-w-4xl overflow-hidden p-0 sm:rounded-xl bg-white dark:bg-[#111c2d] [&>button]:hidden">
          <DialogHeader className="hidden"><DialogTitle>Detail</DialogTitle></DialogHeader>
          {selectedLaporan && (
            <div className="flex flex-col md:flex-row h-[500px]">
              <div className="relative w-full bg-black md:w-3/5 h-[300px] md:h-full flex items-center justify-center">
                <Image src={selectedLaporan.bukti_laporan?.[0]} alt="Laporan" fill className="object-contain" />
                <button onClick={() => setSelectedLaporan(null)} className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden z-20 transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex w-full flex-col border-l border-slate-200 dark:border-white/5 md:w-2/5 h-[200px] md:h-full">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 p-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-xs font-bold text-white ring-2 ring-emerald-500/30">
                      {getInitials((session?.user as any)?.nama_panjang || "User")}
                    </div>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {(session?.user as any)?.nama_panjang || "Anda"}
                    </span>
                  </div>
                  <button onClick={() => setSelectedLaporan(null)} className="hidden md:block text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  <div>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white mr-2">
                      {(session?.user as any)?.nama_panjang || "Anda"}
                    </span>
                    <span className="text-sm font-normal text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedLaporan.deskripsi}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-normal text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    {selectedLaporan.detail?.alamat || "Lokasi tidak diketahui"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}