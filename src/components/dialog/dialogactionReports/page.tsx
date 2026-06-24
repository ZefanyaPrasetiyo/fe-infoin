"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Report, updateReportStatus } from "@/lib/report";
import { MessageSquare, MapPin, X, Bot, Info } from "lucide-react";
import Image from "next/image";

interface DialogActionReportsProps {
  report: Report | null;
  actionType: "detail" | "disetujui" | "ditolak" | null;
  onClose: () => void;
  onSuccess: (id: string, newStatus: "disetujui" | "ditolak", newCatatan: string) => void;
}

export default function DialogActionReports({
  report,
  actionType,
  onClose,
  onSuccess,
}: DialogActionReportsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  useEffect(() => {
    if (actionType === "ditolak") {
      setRejectNote("");
    }
  }, [actionType, report]);

  const handleSubmitAction = async (statusLaporan: "disetujui" | "ditolak") => {
    if (!report) return;
    setIsProcessing(true);

    try {
      const payload = {
        status: statusLaporan,
        catatan: statusLaporan === "ditolak" ? rejectNote : "",
      };

      const res = await updateReportStatus(report.id, payload);

      if (res.success) {
        toast.success(`Laporan berhasil ${statusLaporan}!`);
        onSuccess(report.id, statusLaporan, payload.catatan);
        onClose();
      } else {
        toast.error(res.message || "Gagal memproses laporan");
      }
    } catch (error) {
      console.error("Error action report:", error);
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!report) return null;

  const isMultipleImages = Array.isArray(report.bukti_laporan) && report.bukti_laporan.length > 1;
  const singleImage = Array.isArray(report.bukti_laporan) ? report.bukti_laporan[0] : report.bukti_laporan;

  return (
    <>
      <Dialog open={actionType === "detail"} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="w-full max-w-5xl overflow-hidden p-0 sm:rounded-xl bg-white dark:bg-[#111c2d] [&>button]:hidden">
          <DialogHeader className="hidden">
            <DialogTitle>Detail Laporan</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row md:h-[600px]">
            
            <div className="relative w-full bg-slate-100 dark:bg-black md:w-[55%] h-[300px] md:h-full group overflow-hidden">
              {isMultipleImages ? (
                <Carousel className="w-full h-full relative">
                  <CarouselContent className="h-full ml-0">
                    {report.bukti_laporan.map((img, idx) => (
                      <CarouselItem key={idx} className="pl-0 basis-full"> 
                        <div className="relative w-full h-[300px] md:h-[600px]">
                          <Image
                            src={img}
                            alt={`Bukti ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 55vw"
                            className="object-cover w-full h-full"
                            priority={idx === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white border-none z-20" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white border-none z-20" />
                </Carousel>
              ) : (
                <div className="relative w-full h-[300px] md:h-[600px]">
                  <Image
                    src={singleImage || "/placeholder-image.jpg"} 
                    alt="Bukti Laporan"
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              )}

              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden z-30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex w-full flex-col border-l border-slate-200 dark:border-white/5 md:w-[45%] h-[400px] md:h-full">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 p-4 shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-medium text-slate-900 dark:text-white">Detail & Analisis</h3>
                </div>

                <button
                  onClick={onClose}
                  className="hidden md:block rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                
                <div className="flex flex-col gap-3 pb-5 border-b border-slate-100 dark:border-white/5">
                  <span className="w-fit rounded bg-emerald-500 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                    {report.judul_laporan}
                  </span>
                  <p className="text-sm font-normal text-slate-800 dark:text-slate-200">
                    {report.deskripsi}
                  </p>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 font-light mt-1">
                    <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {report.detail?.alamat || "Lokasi tidak diketahui"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    P
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      Pelapor
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-light leading-relaxed">
                      {report.catatan && report.catatan.includes("Pelapor:") 
                        ? report.catatan 
                        : "Melaporkan kejadian ini via aplikasi."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      Sistem AI Sightengine
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-light leading-relaxed">
                      Hasil deteksi gambar menunjukkan label <span className="font-medium text-emerald-500">{report.detail?.label_ai || "Aman"}</span> dengan tingkat kepercayaan {report.detail?.kepercayaan_ai || "100%"}.
                    </p>
                  </div>
                </div>

                {report.status !== "menunggu" && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-xs font-medium text-amber-700 dark:text-amber-400">
                      <Info className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        Status & Catatan Admin
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-light leading-relaxed">
                        Laporan ini telah di-update menjadi {report.status}. {report.catatan && !report.catatan.includes("Pelapor:") ? `Catatan: ${report.catatan}` : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 dark:border-white/5 p-4 shrink-0">
                <input
                  type="text"
                  placeholder="Hanya dapat dibaca (Read-only)"
                  disabled
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a2332] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none opacity-60 font-light cursor-not-allowed"
                />
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={actionType === "disetujui"} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-normal">Setujui Laporan</AlertDialogTitle>
            <AlertDialogDescription className="font-light">
              Apakah Anda yakin ingin menyetujui laporan ini? Status laporan akan berubah menjadi disetujui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} onClick={onClose} className="font-normal">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleSubmitAction("disetujui"); }}
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-600 font-normal text-white"
            >
              {isProcessing ? "Memproses..." : "Ya, Setujui"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={actionType === "ditolak"} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-normal">Tolak Laporan</DialogTitle>
            <DialogDescription className="font-light">
              Berikan alasan atau catatan mengapa laporan ini ditolak agar pelapor dapat mengetahuinya.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            <Label htmlFor="catatan" className="font-normal">Catatan Penolakan</Label>
            <Input
              id="catatan"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="font-normal"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isProcessing} className="font-normal">
              Batal
            </Button>
            <Button
              onClick={() => handleSubmitAction("ditolak")}
              disabled={isProcessing || !rejectNote}
              variant="destructive"
              className="font-normal"
            >
              {isProcessing ? "Memproses..." : "Tolak Laporan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}