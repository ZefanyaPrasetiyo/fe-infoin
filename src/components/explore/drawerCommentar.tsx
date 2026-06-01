'use client';

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MessageCircleMore, Heart, Reply, Send, MoreVertical } from 'lucide-react';

// Dummy Data Komentar (Simulasi Fetch API)
const dummyComments = [
  {
    id: 1,
    user: { name: "Budi Santoso", avatar: "BS", color: "bg-emerald-500" },
    time: "2 jam yang lalu",
    content: "Wah, bahaya banget ini. Udah lapor ke pihak terkait belum ya? Tolong yang lewat situ hati-hati.",
    replies: [
      {
        id: 2,
        user: { name: "Siti Aminah", avatar: "SA", color: "bg-blue-500" },
        time: "1 jam yang lalu",
        content: "Sudah mas, tadi pagi denger-denger ada petugas yang datang ngecek ke lokasi.",
      }
    ]
  },
  {
    id: 3,
    user: { name: "Andi Saputra", avatar: "AS", color: "bg-amber-500" },
    time: "5 jam yang lalu",
    content: "Titik lokasinya di sebelah mana tepatnya? Sering lewat sana soalnya tiap berangkat kerja.",
    replies: []
  },
  {
    id: 4,
    user: { name: "Reza Rahadian", avatar: "RR", color: "bg-purple-500" },
    time: "1 hari yang lalu",
    content: "Semoga cepat ditangani deh, makin parah aja kalau dibiarin pas musim hujan gini.",
    replies: []
  },
  {
    id: 5,
    user: { name: "Reza Arap", avatar: "RA", color: "bg-purple-500" },
    time: "4 hari yang lalu",
    content: "Semoga cepat ditangani deh, makin parah aja kalau dibiarin pas musim hujan gini.",
    replies: []
  }
];

export function DrawerComment() {
  return (
    <Drawer direction="right">
      
      <Tooltip>
        <TooltipTrigger>
          <DrawerTrigger className="flex flex-col items-center justify-center gap-1 p-2 transition-transform active:scale-95">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-white backdrop-blur-md">
              <MessageCircleMore className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-black dark:text-white drop-shadow-md">124</span>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Komentar</p>
        </TooltipContent>
      </Tooltip>

      <DrawerContent className="h-screen w-full sm:w-[400px] rounded-t-[10px] sm:rounded-none flex flex-col border-l border-slate-200 dark:border-slate-800 z-99999 bg-white dark:bg-black">
        
        <DrawerHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <DrawerTitle className="text-lg">Komentar (124)</DrawerTitle>
          <DrawerDescription>Bagikan informasi atau tanggapanmu.</DrawerDescription>
        </DrawerHeader>
        
        <div className="no-scrollbar flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {dummyComments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-3">
              
              <div className="flex gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${comment.user.color}`}>
                  {comment.user.avatar}
                </div>
                
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{comment.user.name}</span>
                      <span className="text-xs text-slate-500">{comment.time}</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors">
                      <Reply className="h-4 w-4" /> Balas
                    </button>
                  </div>
                </div>
              </div>

              {comment.replies.length > 0 && (
                <div className="flex flex-col gap-4 pl-12 border-l-2 border-slate-100 dark:border-slate-800 ml-[17px] pt-1">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${reply.user.color}`}>
                        {reply.user.avatar}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{reply.user.name}</span>
                          <span className="text-xs text-slate-500">{reply.time}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {reply.content}
                        </p>
                     
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Tambahkan komentar..." 
                className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 transition-colors">
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

      </DrawerContent>
    </Drawer>
  )
}