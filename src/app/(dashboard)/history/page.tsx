"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  CheckCircle2, 
  History,
  Activity,
  AlertCircle,
  Loader2,
   SquareArrowOutUpRight,
} from "lucide-react";
import { getReports } from "@/lib/report";
import ReportDetailDialog from "@/components/dialog/dialogActionHistory/page";

export default function HistoryPage() {
  const { data: session } = useSession();
  const [myReports, setMyReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchMyReports = async () => {
      setLoading(true);
      try {
        const res = await getReports();
        
        if (res.success) {
          const filteredReports = res.data.filter(
            (laporan: any) => laporan.id_user === session.user.id
          );
          setMyReports(filteredReports);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [session]);

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "selesai":
      case "disetujui":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "proses":
      case "diproses":
        return <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 pb-12 pt-8">
        
        <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/15">
              <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-black dark:text-white">Riwayat Laporan</h1>
              <p className="text-xs font-normal text-slate-500">
                Pantau status laporan yang pernah Anda buat
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              <span className="text-sm font-normal">Memuat riwayat laporan...</span>
            </div>
          ) : myReports.length === 0 ? (
            <div className="py-10 text-center text-sm font-normal text-slate-500 dark:text-slate-400">
              Anda belum pernah membuat laporan.
            </div>
          ) : (
            myReports.map((item) => (
              <div 
                key={item.id}
                className="group relative flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 transition-all dark:bg-[#111c2d] dark:ring-white/5"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#1a2332]">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex w-full flex-col gap-0.5 pr-2">
                  <div className="flex items-center justify-between">
                    <h3 className="line-clamp-1 max-w-[200px] text-sm font-medium text-slate-900 sm:max-w-md dark:text-white transition-colors">
                      {item.judul_laporan || "Laporan Tanpa Judul"}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 text-[10px] font-normal text-slate-400 dark:text-slate-500">
                        {formatDate(item.created_at)}
                      </span>
                      <button 
                        onClick={() => setSelectedReport(item)}
                        title="Lihat Detail"
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-white/10 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        <SquareArrowOutUpRight className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-xs font-normal leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.deskripsi || "Tidak ada deskripsi"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ReportDetailDialog 
        report={selectedReport} 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)} 
      />
    </>
  );
}