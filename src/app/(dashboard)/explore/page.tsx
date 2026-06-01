"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, MapPin, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const laporanDummy = [
  {
    id: 1,
    deskripsi: "Kecelakaan lalu lintas di jalan raya, mobil ringsek",
    lokasi: "Tol Cipularang KM 72",
    kategori: "Lalu Lintas",
    image: "/images/ilustration/ilustrasi-laporan-1.jpeg",
    commentsCount: 24,
    comments: [
      { user: "Budi", text: "Wah ngeri banget, semoga gak ada korban jiwa." },
      { user: "Siti", text: "Udah ada polisi belum di lokasi?" }
    ]
  },
  {
    id: 2,
    deskripsi: "Macet parah tidak bergerak sama sekali",
    kategori: "Infrastruktur",
    lokasi: "Jalan Tol Jakarta - Bandung",
    image: "/images/ilustration/ilustrasi-laporan-2.jpg",
    commentsCount: 12,
    comments: [
      { user: "Agus", text: "Hindari jalur ini ges, parah macetnya." }
    ]
  },
  {
    id: 3,
    deskripsi: "Tanah longsor menutup separuh badan jalan",
    lokasi: "Puncak Bogor",
    kategori: "Lingkungan",
    image: "/images/ilustration/ilustrasi-laporan-3.jpg",
    commentsCount: 56,
    comments: [
      { user: "Asep", text: "Aduh mana lagi musim hujan, bahaya bgt." },
      { user: "Putri", text: "Semoga cepat ditangani alat berat." }
    ]
  },
];

export default function ExplorePage() {
  const [selectedLaporan, setSelectedLaporan] = useState<typeof laporanDummy[0] | null>(null);

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {laporanDummy.map((laporan) => (
            <Card 
              key={laporan.id} 
              className="group cursor-pointer overflow-hidden rounded-none border-none shadow-none"
              onClick={() => setSelectedLaporan(laporan)}
            >
              <CardContent className="relative aspect-square w-full p-0">
                <Image
                  src={laporan.image}
                  alt={laporan.deskripsi}
                  fill 
                  sizes="(max-width: 768px) 33vw, 30vw"
                  className="object-cover"
                />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2 text-white">
                    <MessageSquare className="h-6 w-6 fill-white" />
                    <span className="text-lg font-bold">{laporan.commentsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedLaporan} onOpenChange={(open) => !open && setSelectedLaporan(null)}>
        <DialogContent className="w-full max-w-7xl overflow-hidden p-0 sm:rounded-xl bg-white dark:bg-[#111c2d] [&>button]:hidden">
          <DialogHeader className="hidden">
            <DialogTitle>Detail Laporan</DialogTitle>
          </DialogHeader>

          {selectedLaporan && (
            <div className="flex flex-col md:flex-row md:h-[600px]">
              
              <div className="relative w-full bg-slate-100 dark:bg-black md:w-3/5 h-[300px] md:h-full">
                <Image
                  src={selectedLaporan.image}
                  alt={selectedLaporan.deskripsi}
                  fill
                  className="object-cover md:object-contain"
                />
                
                <button 
                  onClick={() => setSelectedLaporan(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden z-10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-0 w-full bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                  <span className="mb-2 inline-block rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {selectedLaporan.kategori}
                  </span>
                  <p className="text-sm font-medium text-white md:text-base line-clamp-3">
                    {selectedLaporan.deskripsi}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    {selectedLaporan.lokasi}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col border-l border-slate-200 dark:border-white/5 md:w-2/5 h-[400px] md:h-full">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Komentar</h3>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedLaporan(null)}
                    className="hidden md:block rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {selectedLaporan.comments.map((comment, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          {comment.user}
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 p-4">
                  <input
                    type="text"
                    placeholder="Tambahkan komentar..."
                    className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a2332] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}