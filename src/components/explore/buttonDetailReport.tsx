import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ButtonDetailReport() {
  return (
    <Link href="/detail-report" className="w-full">
    <button className="w-full justify-between">
     <Tooltip>
        <TooltipTrigger>
            <div className="flex h-8 w-8 flex items-center justify-center rounded-full bg-slate-800/50 text-white backdrop-blur-md">
            <ExternalLink className="h-4 w-4" />
            </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Detail laporan</p>
        </TooltipContent>
      </Tooltip>
 
    </button>
    </Link>
  );
}