'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ButtonShareReport({ reportId = "123" }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/report/${reportId}`;
    const shareData = {
      title: 'Cek Laporan Ini di Infoin',
      text: 'Bantu pantau masalah di lingkungan ini yuk!',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <button 
          onClick={handleShare}
          className="flex flex-col items-center justify-center gap-1 p-2 transition-transform active:scale-95"
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md transition-colors ${copied ? 'bg-emerald-600' : 'bg-slate-800/50'}`}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4 ml-[-2px]" /> 
            )}
          </div>
          {/* <span className="text-xs font-semibold text-white drop-shadow-md">
            {copied ? 'Tersalin' : 'Share'}
          </span> */}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{copied ? 'Link disalin!' : 'Bagikan Laporan'}</p>
      </TooltipContent>
    </Tooltip>
  );
}