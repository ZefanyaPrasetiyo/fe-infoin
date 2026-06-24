"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, MapPin, X, Loader2, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getReports } from "@/lib/report";
import { getComments, createComment } from "@/lib/comments";

export default function ExplorePage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState<any | null>(null);
  
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        if (res.success) {
          setReports(res.data);
        } else {
          toast.error("Gagal memuat laporan");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan pada server");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!selectedLaporan) {
      setComments([]);
      setReplyingTo(null);
      setInputComment("");
      return;
    }

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await getComments(selectedLaporan.id);
        if (res.success) {
          setComments(res.data);
        }
      } catch (error) {
        console.error("Error fetch comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [selectedLaporan]);

  useEffect(() => {
    if (!selectedLaporan || !selectedLaporan.bukti_laporan || selectedLaporan.bukti_laporan.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedLaporan.bukti_laporan.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedLaporan]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim() || submittingComment || !selectedLaporan || !session?.user?.id) return;

    setSubmittingComment(true);
    try {
      const payload = {
        id_user: session.user.id,
        id_report: selectedLaporan.id,
        message: inputComment,
        id_parent: replyingTo ? replyingTo.id : null,
      };

      const res = await createComment(payload);
      if (res.success) {
        setInputComment("");
        setReplyingTo(null);
        const updateRes = await getComments(selectedLaporan.id);
        if (updateRes.success) {
          setComments(updateRes.data);
        }
      } else {
        toast.error(res.message || "Gagal mengirim komentar");
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server");
    } finally {
      setSubmittingComment(false);
    }
  };

  const filteredLaporan = reports.filter(
    (laporan) => laporan.detail?.id_location === session?.user?.id_location
  );

  const nextImage = () => {
    if (!selectedLaporan?.bukti_laporan) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedLaporan.bukti_laporan.length);
  };

  const prevImage = () => {
    if (!selectedLaporan?.bukti_laporan) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedLaporan.bukti_laporan.length) % selectedLaporan.bukti_laporan.length);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm font-normal">Memuat laporan warga...</p>
          </div>
        ) : filteredLaporan.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <MapPin className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm font-normal">Belum ada laporan di wilayah Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {filteredLaporan.map((laporan) => (
              <Card 
                key={laporan.id} 
                className="group cursor-pointer overflow-hidden rounded-none border-none shadow-none"
                onClick={() => {
                  setSelectedLaporan(laporan);
                  setCurrentImageIndex(0);
                }}
              >
                <CardContent className="relative aspect-square w-full p-0">
                  <Image
                    src={laporan.bukti_laporan?.[0] || "/images/ilustration/ilustrasi-laporan-1.jpeg"}
                    alt={laporan.judul_laporan || "Laporan"}
                    fill 
                    sizes="(max-width: 768px) 33vw, 30vw"
                    className="object-cover bg-slate-100 dark:bg-slate-800"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <div className="flex items-center gap-2 text-white">
                      <MessageSquare className="h-6 w-6 fill-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedLaporan} onOpenChange={(open) => !open && setSelectedLaporan(null)}>
        <DialogContent className="w-full max-w-7xl overflow-hidden p-0 sm:rounded-xl bg-white dark:bg-[#111c2d] [&>button]:hidden">
          <DialogHeader className="hidden">
            <DialogTitle>Detail Laporan</DialogTitle>
          </DialogHeader>

          {selectedLaporan && (
            <div className="flex flex-col md:flex-row md:h-[600px]">
              
              <div className="relative w-full bg-slate-100 dark:bg-black md:w-3/5 h-[300px] md:h-full group">
                {selectedLaporan.bukti_laporan && selectedLaporan.bukti_laporan.length > 0 ? (
                  selectedLaporan.bukti_laporan.map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={selectedLaporan.judul_laporan || "Laporan"}
                      fill
                      className={`object-cover md:object-contain transition-opacity duration-500 ${
                        idx === currentImageIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
                      }`}
                    />
                  ))
                ) : (
                  <Image
                    src="/images/ilustration/ilustrasi-laporan-1.jpeg"
                    alt="Laporan"
                    fill
                    className="object-cover md:object-contain"
                  />
                )}
                
                <button 
                  onClick={() => setSelectedLaporan(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden z-20 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {selectedLaporan.bukti_laporan && selectedLaporan.bukti_laporan.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 z-10 cursor-pointer hidden md:block"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 z-10 cursor-pointer hidden md:block"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {selectedLaporan.bukti_laporan.map((_: any, idx: number) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex ? "w-4 bg-emerald-500" : "w-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute bottom-0 w-full bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 pt-20 z-10">
                  <h2 className="text-lg font-medium text-white mb-1 leading-snug">
                    {selectedLaporan.judul_laporan}
                  </h2>
                  <p className="text-sm font-normal text-slate-300 md:text-sm line-clamp-2 leading-relaxed">
                    {selectedLaporan.deskripsi}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-normal text-emerald-400">
                    <MapPin className="h-4 w-4" />
                    {selectedLaporan.detail?.alamat || "Lokasi tidak diketahui"}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col border-l border-slate-200 dark:border-white/5 md:w-2/5 h-[400px] md:h-full">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 p-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Komentar ({comments.length})
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedLaporan(null)}
                    className="hidden md:block rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                  {loadingComments ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-xs font-normal text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                      Memuat komentar...
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment: any, idx: number) => {
                      const userName = comment.user?.nama_panjang || "Anonim";
                      return (
                        <div key={idx} className="flex flex-col animate-in fade-in duration-200">
                          <div className="flex gap-3">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col text-sm w-full">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 dark:text-slate-200">
                                  {userName}
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                  {new Date(comment.created_at).toLocaleDateString('id-ID')}
                                </span>
                                <button
                                  onClick={() => setReplyingTo(comment)}
                                  className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 ml-1"
                                >
                                  Balas
                                </button>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-normal leading-relaxed">
                                {comment.message}
                              </p>
                            </div>
                          </div>

                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 ml-4 pl-4 border-l-2 border-slate-100 dark:border-white/5 flex flex-col gap-4">
                              {comment.replies.map((reply: any, rIdx: number) => {
                                const replyUserName = reply.user?.nama_panjang || "Anonim";
                                return (
                                  <div key={rIdx} className="flex gap-3">
                                    <div className="h-6 w-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                      {replyUserName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900 dark:text-slate-200">
                                          {replyUserName}
                                        </span>
                                        <span className="text-[10px] font-normal text-slate-400">
                                          {new Date(reply.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                      </div>
                                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-normal leading-relaxed">
                                        {reply.message}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500 font-normal">
                      Belum ada komentar. Jadilah yang pertama.
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 p-4 shrink-0 flex flex-col relative bg-white dark:bg-[#111c2d]">
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1a2332] px-4 py-2 mb-2 rounded-lg border border-slate-100 dark:border-white/5">
                      <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                        Membalas <span className="font-medium text-emerald-600 dark:text-emerald-400">{replyingTo.user?.nama_panjang || "Anonim"}</span>
                      </span>
                      <button 
                        onClick={() => setReplyingTo(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSendComment} className="relative flex items-center">
                    <input
                      type="text"
                      value={inputComment}
                      onChange={(e) => setInputComment(e.target.value)}
                      disabled={submittingComment}
                      placeholder={submittingComment ? "Mengirim..." : replyingTo ? "Tulis balasan..." : "Tambahkan komentar..."}
                      className="w-full font-normal rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a2332] pl-4 pr-12 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputComment.trim() || submittingComment}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 transition-colors cursor-pointer"
                    >
                      {submittingComment ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5 ml-0.5" />
                      )}
                    </button>
                  </form>
                </div>
                
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}