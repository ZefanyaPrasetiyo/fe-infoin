"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { MapPin, Loader2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DrawerComment } from "@/components/explore/drawerCommentar";
import { ButtonShareReport } from "@/components/explore/buttonShareReport";
import { useEffect, useState } from "react";
import { getReports, Report } from "@/lib/report";
import { toast } from "sonner";
import DialogActionReports from "@/components/dialog/dialogactionReports/page";

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"detail" | "disetujui" | "ditolak" | null>(null);

  const currentUserId = "01KTM2K4MNMKJQKM5NZSG4FK7W";

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await getReports();
        if (res.success) {
          setReports(res.data);
        } else {
          toast.error("Gagal memuat data beranda");
        }
      } catch (error) {
        console.error("Error fetching home reports:", error);
        toast.error("Gagal terhubung ke server");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm font-normal text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        Memuat beranda...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-normal text-slate-500">
        Belum ada laporan warga saat ini.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex items-center justify-center py-2">
        <Carousel
          opts={{
            align: "start",
            watchDrag: true,
            loop: true,
          }}
          orientation="vertical"
          className="w-full max-w-2xl"
        >
          <CarouselContent className="m-0 h-[80vh]">
            {reports.map((laporan, index) => {
              const singleImage = Array.isArray(laporan.bukti_laporan) 
                ? laporan.bukti_laporan[0] 
                : laporan.bukti_laporan;

              return (
                <CarouselItem key={laporan.id} className="h-full p-0">
                  <div className="relative mx-auto h-full w-full max-w-sm p-2">
                    <Card className="relative h-full w-full overflow-hidden border-0 bg-slate-900 shadow-lg">
                     <CardContent className="h-full p-0">
  <div className="relative h-full w-full bg-slate-950">
    <Image
      src={
        Array.isArray(laporan.bukti_laporan) && laporan.bukti_laporan.length > 0
          ? laporan.bukti_laporan[0]
          : "/placeholder-image.jpg"
      }
      alt={laporan.deskripsi || "Bukti Laporan"}
      fill
      sizes="(max-width: 768px) 100vw, 384px"
      className="object-contain w-full h-full"
      priority={index === 0}
    />
  </div>

  <div className="bg-linear-to-t pointer-events-none absolute inset-0 h-full from-black/90 via-black/30 to-transparent z-10" />

  <div className="absolute bottom-8 left-0 right-0 p-6 text-white z-20">
    <div className="mb-4 flex flex-row items-center gap-2">
      <Badge
        variant="secondary"
        className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md text-[11px] font-normal text-white border-none py-1"
      >
        <MapPin size={14} className="shrink-0 text-emerald-400" />
        <span className="truncate max-w-[150px]">
          {laporan.detail?.alamat || "Lokasi tidak diketahui"}
        </span>
      </Badge>
      <Badge
        variant="outline"
        className="border-emerald-400/50 bg-emerald-500/10 backdrop-blur-md text-[11px] font-normal text-emerald-400 py-1"
      >
        {laporan.judul_laporan}
      </Badge>
    </div>
    <h3 className="text-sm mb-2 line-clamp-3 font-light leading-relaxed text-slate-100 capitalize">
      {laporan.deskripsi}
    </h3>
  </div>
</CardContent>
                    </Card>

                    <div className="absolute bottom-24 right-4 z-20 flex flex-col items-center gap-5 sm:-right-16 sm:bottom-1/2 sm:translate-y-1/2">
                      <div className="flex flex-col items-center drop-shadow-md transition-transform hover:scale-105">
                        <DrawerComment 
                          idReport={laporan.id} 
                          idUser={currentUserId}
                        />
                      </div>
                      
                      <div className="flex flex-col items-center drop-shadow-md transition-transform hover:scale-105">
                        <button 
                          onClick={() => {
                            setSelectedReport(laporan);
                            setActionType("detail");
                          }}
                          title="Detail laporan"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-white backdrop-blur-md transition-transform active:scale-95 hover:bg-slate-800/70 border-none"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center drop-shadow-md transition-transform hover:scale-105">
                        <ButtonShareReport />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 mx-auto hidden w-full max-w-sm sm:block">
            <CarouselPrevious className="pointer-events-auto -left-16 top-[45%] bg-white/10 text-white border-none hover:bg-white/20" />
            <CarouselNext className="pointer-events-auto -left-16 top-[55%] translate-y-0 bg-white/10 text-white border-none hover:bg-white/20" />
          </div>
        </Carousel>
      </div>

      <DialogActionReports 
        report={selectedReport}
        actionType={actionType}
        onClose={() => {
          setSelectedReport(null);
          setActionType(null);
        }}
        onSuccess={(id, status, catatan) => {
          setReports((prev) => prev.map((r) => r.id === id ? { ...r, status, catatan } : r));
        }}
      />

    </div>
  );
}