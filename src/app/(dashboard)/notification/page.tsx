"use client";

import React, { useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CheckCheck, 
  Send 
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "success",
    title: "Laporan Selesai Ditangani",
    description: "Laporan jalan rusak di Sudirman telah selesai diperbaiki oleh petugas. Terima kasih atas laporan Anda!",
    time: "2 jam yang lalu",
    isRead: false,
  },
  {
    id: "2",
    type: "process",
    title: "Laporan Sedang Diproses",
    description: "Laporan penumpukan sampah (LPR-89231) sedang dalam peninjauan dinas terkait.",
    time: "5 jam yang lalu",
    isRead: false,
  },
  {
    id: "3",
    type: "reject",
    title: "Laporan Ditolak",
    description: "Mohon maaf, laporan Anda ditolak karena foto bukti terlalu gelap dan tidak jelas. Silakan buat laporan ulang.",
    time: "1 hari yang lalu",
    isRead: true,
  },
  {
    id: "4",
    type: "sent",
    title: "Laporan Berhasil Dikirim",
    description: "Laporan Anda dengan nomor LPR-89231 berhasil masuk ke dalam sistem kami.",
    time: "1 hari yang lalu",
    isRead: true,
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotifConfig = (type: string) => {
    switch (type) {
      case "success":
        return { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-100 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" };
      case "process":
        return { icon: <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20" };
      case "reject":
        return { icon: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />, bg: "bg-red-100 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/20" };
      case "sent":
        return { icon: <Send className="h-4 w-4 text-slate-600 dark:text-slate-400" />, bg: "bg-slate-200 dark:bg-slate-500/10", border: "border-slate-300 dark:border-slate-500/20" };
      default:
        return { icon: <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />, bg: "bg-slate-200 dark:bg-slate-500/10", border: "border-slate-300 dark:border-slate-500/20" };
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 pb-12">
      
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
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 dark:bg-[#111c2d] ring-1 ring-slate-200 dark:ring-white/5 py-12 text-center">
            <Bell className="h-10 w-10 text-slate-400 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada notifikasi saat ini.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const config = getNotifConfig(notif.type);
            
            return (
              <div 
                key={notif.id}
                className={[
                  "relative flex items-start gap-3 rounded-xl p-3 transition-all cursor-pointer ring-1 ring-slate-200 dark:ring-white/5",
                  notif.isRead 
                    ? "bg-white/50 dark:bg-[#111c2d]/40 opacity-70 hover:opacity-100" 
                    : "bg-white dark:bg-[#111c2d] shadow-sm hover:ring-emerald-500/30 dark:hover:ring-emerald-500/30"
                ].join(" ")}
              >
                {!notif.isRead && (
                  <div className="absolute top-4 right-3 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                )}

                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${config.bg} ${config.border}`}>
                  {config.icon}
                </div>
                <div className="flex flex-col gap-0.5 pr-6 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold truncate max-w-[200px] sm:max-w-md ${notif.isRead ? "text-slate-600 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {notif.description}
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