"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

const STATS_DATA = [
  { label: "Menunggu Approval", value: "24", color: "text-amber-500" },
  { label: "Total Laporan Hari Ini", value: "156", color: "text-blue-500" },
];

const LAPORAN_DUMMY = [
  { id: 1, kode: "LPR-001", user: "Budi Santoso", kategori: "Infrastruktur", status: "Menunggu", statusBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
  { id: 2, kode: "LPR-002", user: "Siti Aminah", kategori: "Keamanan", status: "Menunggu", statusBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
  { id: 3, kode: "LPR-003", user: "Agus Salim", kategori: "Lingkungan", status: "Disetujui", statusBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
  { id: 4, kode: "LPR-004", user: "Dina Rosita", kategori: "Kesehatan", status: "Ditolak", statusBg: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" },
  { id: 5, kode: "LPR-005", user: "Fajar Wibowo", kategori: "Sosial", status: "Menunggu", statusBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
];

export default function MasterLaporanPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Validasi Laporan Masuk</h1>
          <button className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-8 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between dark:border-white/5">
          <div className="grid grid-cols-2 gap-8 md:flex md:gap-16">
            {STATS_DATA.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className={`text-3xl md:text-4xl font-medium ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-medium text-gray-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableCell className="pb-4 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 w-16">No</TableCell>
                <TableCell className="pb-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Kode Laporan</TableCell>
                <TableCell className="pb-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Nama User</TableCell>
                <TableCell className="pb-4 text-xs font-semibold text-gray-400 dark:text-gray-500">Kategori</TableCell>
                <TableCell className="pb-4 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">Status</TableCell>
                <TableCell className="pb-4 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {LAPORAN_DUMMY.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                >
                  <TableCell className="py-4 px-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-4 px-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {row.kode}
                  </TableCell>

                  <TableCell className="py-4 px-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {row.user}
                  </TableCell>

                  <TableCell className="py-4 px-2 text-sm text-gray-500 dark:text-gray-400">
                    {row.kategori}
                  </TableCell>

                  <TableCell className="py-4 px-2 text-center">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${row.statusBg}`}>
                      {row.status}
                    </span>
                  </TableCell>
                
                  <TableCell className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-full text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>

                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
      </div>
    </div>
  );
}