"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getNotifications, markNotificationAsRead } from "@/lib/notifications"; // Sesuaikan path jika beda
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Activity, 
  Loader2, 
  CheckCheck 
} from "lucide-react";

// Fungsi helper dari kode atas lu (Gua tambahin properti border biar nyambung sama UI lu)
const getNotificationContent = (notif: any, userRole?: string) => {
  const statusLaporan = notif.report?.status || "menunggu";

  if (userRole === "admin" || userRole === "petugas") {
    if (notif.type === "new_report") {
      return {
        title: "Laporan Baru Masuk",
        message: `Warga mengirim laporan baru: "${notif.report?.judul_laporan || "Tanpa Judul"}".`,
        icon: <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
        bg: "bg-blue-100 dark:bg-blue-500/10",
        border: "border-blue-200 dark:border-blue-500/20",
      };
    }
  }

  if (userRole === "user") {
    if (notif.type === "status_update") {
      switch (statusLaporan) {
        case "disetujui":
          return {
            title: "Laporan Disetujui!",
            message: `Laporan "${notif.report?.judul_laporan}" lu udah disetujui petugas.`,
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
            bg: "bg-emerald-100 dark:bg-emerald-500/10",
            border: "border-emerald-200 dark:border-emerald-500/20",
          };
        case "ditolak":
          return {
            title: "Laporan Ditolak",
            message: `Laporan "${notif.report?.judul_laporan}" ditolak. Cek detailnya.`,
            icon: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
            bg: "bg-red-100 dark:bg-red-500/10",
            border: "border-red-200 dark:border-red-500/20",
          };
        case "diproses":
          return {
            title: "Laporan Sedang Diproses",
            message: `Laporan "${notif.report?.judul_laporan}" sedang ditindaklanjuti.`,
            icon: <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
            bg: "bg-amber-100 dark:bg-amber-500/10",
            border: "border-amber-200 dark:border-amber-500/20",
          };
      }
    }
  }

  // Fallback System Notification
  return {
    title: "Notifikasi Sistem",
    message: "Anda memiliki pemberitahuan baru.",
    icon: <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />,
    bg: "bg-slate-200 dark:bg-slate-500/10",
    border: "border-slate-300 dark:border-slate-500/20",
  };
};

export default function NotificationPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil Notifikasi dari API
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const res = await getNotifications(session.user.id);
        if (res.success) {
          setNotifications(res.data);
        }
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, [session?.user?.id]);

  // Hitung yang belum dibaca (API biasanya pakai is_read)
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = async (notifId: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markNotificationAsRead(notifId);
        // Update state lokal
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
        );
      } catch (error) {
        console.error("Gagal update notifikasi:", error);
      }
    }
  };

  const markAllAsRead = () => {
    // Note: Kalau lu punya endpoint API buat nembak mark-all-read, panggil di sini
    // Untuk saat ini kita ubah UI state-nya aja biar langsung instan
    setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 pb-12 mt-8 md:mt-0">
      
      {/* HEADER NOTIFIKASI */}
      <div className="flex items-end justify-between border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/15">
            <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black dark:text-white">Notifikasi</h1>
            <p className="text-xs text-slate-500">
              {unreadCount > 0 
                ? `Anda memiliki ${unreadCount} notifikasi baru` 
                : "Semua notifikasi sudah dibaca"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:scale-95"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Tandai semua dibaca</span>
          </button>
        )}
      </div>

      {/* LIST NOTIFIKASI */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm font-normal">Memuat notifikasi...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 dark:bg-[#111c2d] ring-1 ring-slate-200 dark:ring-white/5 py-12 text-center">
            <Bell className="h-10 w-10 text-slate-400 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada notifikasi saat ini.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            // Ambil konten dinamis (icon, warna, text) berdasarkan data API
            const content = getNotificationContent(notif, session?.user?.role);
            
            return (
              <div 
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.is_read)}
                className={[
                  "relative flex items-start gap-3 rounded-xl p-3 transition-all cursor-pointer ring-1 ring-slate-200 dark:ring-white/5",
                  notif.is_read 
                    ? "bg-white/50 dark:bg-[#111c2d]/40 opacity-70 hover:opacity-100" 
                    : "bg-white dark:bg-[#111c2d] shadow-sm hover:ring-emerald-500/30 dark:hover:ring-emerald-500/30"
                ].join(" ")}
              >
                {/* Indikator Titik Hijau (Belum Dibaca) */}
                {!notif.is_read && (
                  <div className="absolute top-4 right-3 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                )}

                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${content.bg} ${content.border}`}>
                  {content.icon}
                </div>
                
                <div className="flex flex-col gap-0.5 pr-6 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className={`text-sm font-semibold truncate max-w-[200px] sm:max-w-md ${notif.is_read ? "text-slate-600 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                      {content.title}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 sm:mt-0">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                    {content.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}