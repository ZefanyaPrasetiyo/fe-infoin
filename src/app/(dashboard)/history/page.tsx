"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  History,
  Activity,
  AlertCircle
} from "lucide-react";

const MOCK_POSTS = [
  {
    id: "LPR-89231",
    title: "Jalan berlubang parah di pertigaan lampu merah",
    date: "12 Mei 2026, 14:30",
    status: "selesai",
    category: "Infrastruktur",
    excerpt: "Lubangnya cukup dalam dan sangat membahayakan pengendara motor. Sudah ditangani petugas.",
  },
  {
    id: "LPR-89232",
    title: "Lampu jalan mati total di sepanjang jalan",
    date: "10 Mei 2026, 19:15",
    status: "proses",
    category: "Keamanan",
    excerpt: "Menunggu jadwal teknisi lapangan untuk pengecekan jaringan listrik sekitar.",
  }
];

const MOCK_COMMENTS = [
  {
    id: "C-1",
    reportTitle: "Banjir genangan air di depan stasiun",
    reportId: "LPR-89220",
    comment: "Betul min, tadi pagi saya lewat situ airnya lumayan tinggi sampai betis. Tolong segera ditangani ya.",
    date: "13 Mei 2026, 08:20",
  },
  {
    id: "C-2",
    reportTitle: "Fasilitas halte rusak parah",
    reportId: "LPR-89215",
    comment: "Kacanya juga pecah tuh, bahaya banget buat yang lagi nunggu bis.",
    date: "11 Mei 2026, 16:45",
  }
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "selesai":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "proses":
        return <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 pb-12 pt-8">
      
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/15">
            <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black dark:text-white">Riwayat Aktivitas</h1>
            <p className="text-xs text-slate-500">
              Pantau laporan dan komentar yang pernah Anda buat
            </p>
          </div>
        </div>

        <div className="flex w-full rounded-lg bg-slate-100 dark:bg-[#111c2d] p-1 ring-1 ring-slate-200 dark:ring-white/5 sm:w-fit">
          <button
            onClick={() => setActiveTab("posts")}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all sm:flex-none",
              activeTab === "posts" 
                ? "bg-white text-emerald-600 shadow-sm dark:bg-[#1a2332] dark:text-emerald-400" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            ].join(" ")}
          >
            <FileText className="h-3.5 w-3.5" />
            Laporan Saya
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all sm:flex-none",
              activeTab === "comments" 
                ? "bg-white text-emerald-600 shadow-sm dark:bg-[#1a2332] dark:text-emerald-400" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            ].join(" ")}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Komentar Saya
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        
        {activeTab === "posts" && (
          MOCK_POSTS.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Anda belum pernah membuat laporan.
            </div>
          ) : (
            MOCK_POSTS.map((post) => (
              <Link 
                href={`/laporan/detail/${post.id}`}
                key={post.id}
                className="group relative flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 transition-all hover:ring-emerald-500/30 dark:bg-[#111c2d] dark:ring-white/5 dark:hover:ring-emerald-500/30"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#1a2332]">
                  {getStatusIcon(post.status)}
                </div>
                <div className="flex w-full flex-col gap-0.5 pr-2">
                  <div className="flex items-center justify-between">
                    <h3 className="line-clamp-1 max-w-[200px] text-sm font-semibold text-slate-900 group-hover:text-emerald-600 sm:max-w-md dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {post.date}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))
          )
        )}

        {activeTab === "comments" && (
          MOCK_COMMENTS.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Anda belum pernah memberikan komentar.
            </div>
          ) : (
            MOCK_COMMENTS.map((comment) => (
              <Link 
                href={`/laporan/detail/${comment.reportId}`}
                key={comment.id}
                className="group relative flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 transition-all hover:ring-emerald-500/30 dark:bg-[#111c2d] dark:ring-white/5 dark:hover:ring-emerald-500/30"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex w-full flex-col gap-1 pr-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      Komentar di: <span className="font-semibold text-slate-700 dark:text-slate-300">"{comment.reportTitle}"</span>
                    </p>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {comment.date}
                    </span>
                  </div>
                  <div className="relative rounded-md border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600 dark:border-white/5 dark:bg-[#1a2332] dark:text-slate-300">
                    <div className="absolute left-0 top-0 h-full w-0.5 rounded-l-md bg-emerald-500/50"></div>
                    "{comment.comment}"
                  </div>
                </div>
              </Link>
            ))
          )
        )}

      </div>
    </div>
  );
}