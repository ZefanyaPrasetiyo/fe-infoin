'use client';

import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircleMore, Reply, Send, Trash2, Loader2, X } from 'lucide-react';
import { getComments, createComment, deleteComment, CommentData } from "@/lib/comments";
import { toast } from "sonner";

interface DrawerCommentProps {
  idReport: string;
  idUser: string;
}

interface ReplyState {
  idParent: string;
  targetName: string;
}

export function DrawerComment({ idReport, idUser }: DrawerCommentProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // 🚨 State untuk memantau apakah user lagi ngebalas komen orang
  const [activeReply, setActiveReply] = useState<ReplyState | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchComments = async () => {
    if (!idReport) return;
    setLoading(true);
    try {
      const res = await getComments(idReport);
      if (res.success) {
        setComments(res.data);
      } else {
        toast.error("Gagal memuat komentar");
      }
    } catch (error) {
      console.error("Error fetch comments:", error);
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, idReport]);

  const handleAddComment = async () => {
    if (!inputValue.trim() || submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        id_user: idUser,
        id_report: idReport,
        message: inputValue,
        // 🚨 Kalau activeReply ada isinya, kirim idParent-nya ke Laravel
        id_parent: activeReply ? activeReply.idParent : null 
      };

      const res = await createComment(payload);
      if (res.success) {
        toast.success(activeReply ? "Balasan terkirim" : "Komentar terkirim");
        setInputValue("");
        setActiveReply(null); // Reset mode reply setelah sukses mengirim
        fetchComments(); 
      } else {
        toast.error(res.message || "Gagal mengirim komentar");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Gagal terhubung ke server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await deleteComment(id);
      if (res.success) {
        toast.success("Komentar dihapus");
        fetchComments(); 
      } else {
        toast.error(res.message || "Gagal menghapus komentar");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Gagal menghapus komentar dari server");
    }
  };

  // 🚨 Fungsi pemicu saat tombol 'Balas' diklik
  const initiateReply = (idParent: string, userName: string) => {
    setActiveReply({
      idParent,
      targetName: userName
    });
    // Auto fokus ke input chat biar user tinggal ketik
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const getAvatarInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const totalComments = comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      
      <Tooltip>
        <TooltipTrigger>
          <DrawerTrigger className="flex flex-col items-center justify-center gap-1 p-2 transition-transform active:scale-95 border-none bg-transparent cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 text-white backdrop-blur-md">
              <MessageCircleMore className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-black dark:text-white drop-shadow-md">
              {totalComments}
            </span>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="font-normal">Komentar</p>
        </TooltipContent>
      </Tooltip>

      <DrawerContent className="h-screen w-full sm:w-[400px] rounded-t-[10px] sm:rounded-none flex flex-col border-l border-slate-200 dark:border-slate-800 z-[99999] bg-white dark:bg-black">
        
        <DrawerHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <DrawerTitle className="text-lg font-medium">Komentar ({totalComments})</DrawerTitle>
          <DrawerDescription className="font-normal">Bagikan informasi atau tanggapanmu.</DrawerDescription>
        </DrawerHeader>
        
        <div className="no-scrollbar flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm font-normal text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              Memuat komentar...
            </div>
          ) : comments.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm font-normal text-slate-500">
              Belum ada komentar. Jadilah yang pertama!
            </div>
          ) : (
            comments.map((comment) => {
              const mainUserName = comment.user?.nama_panjang || comment.user?.name || "Anonim";
              return (
                <div key={comment.id} className="flex flex-col gap-3">
                  
                  <div className="flex gap-3 group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white bg-emerald-500">
                      {getAvatarInitials(mainUserName)}
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {mainUserName}
                          </span>
                          <span className="text-xs font-normal text-slate-400">
                            {new Date(comment.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        
                        {comment.id_user === idUser && (
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Hapus Komentar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm font-normal text-slate-700 dark:text-slate-300 leading-relaxed">
                        {comment.message}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <button 
                          onClick={() => initiateReply(comment.id, mainUserName)}
                          className="flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          <Reply className="h-4 w-4" /> Balas
                        </button>
                      </div>
                    </div>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="flex flex-col gap-4 pl-12 border-l-2 border-slate-100 dark:border-slate-800 ml-[17px] pt-1">
                      {comment.replies.map((reply) => {
                        const replyUserName = reply.user?.nama_panjang || reply.user?.name || "Anonim";
                        return (
                          <div key={reply.id} className="flex gap-3 group">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white bg-blue-500">
                              {getAvatarInitials(replyUserName)}
                            </div>
                            <div className="flex flex-1 flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {replyUserName}
                                  </span>
                                  <span className="text-xs font-normal text-slate-400">
                                    {new Date(reply.created_at).toLocaleDateString('id-ID')}
                                  </span>
                                </div>
                                
                                {reply.id_user === idUser && (
                                  <button 
                                    onClick={() => handleDeleteComment(reply.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                    title="Hapus Balasan"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                              <p className="text-sm font-normal text-slate-700 dark:text-slate-300 leading-relaxed">
                                {reply.message}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-0.5">
                                <button 
                                  onClick={() => initiateReply(comment.id, replyUserName)}
                                  className="flex items-center gap-1.5 text-[11px] font-normal text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                                >
                                  <Reply className="h-3.5 w-3.5" /> Balas
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-black shrink-0 flex flex-col gap-2">
          
          {activeReply && (
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-md text-xs font-normal text-slate-500 animate-in fade-in duration-200">
              <span>Membalas <span className="text-emerald-500 font-medium">@{activeReply.targetName}</span></span>
              <button 
                onClick={() => setActiveReply(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input 
                ref={inputRef}
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={submitting}
                placeholder={submitting ? "Mengirim..." : activeReply ? `Balas @${activeReply.targetName}...` : "Tambahkan komentar..."} 
                className="w-full font-normal rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-shadow disabled:opacity-50"
              />
              <button 
                onClick={handleAddComment}
                disabled={!inputValue.trim() || submitting}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-colors"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

      </DrawerContent>
    </Drawer>
  );
}