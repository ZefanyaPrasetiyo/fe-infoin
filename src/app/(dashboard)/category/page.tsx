"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {DialogAddCategory} from "@/components/dialog/dialogCreateCategory/page"

const STATS_DATA = [
  { label: "Total Kategori", value: "12", color: "text-emerald-600" },
  { label: "Ditambahkan Bulan Ini", value: "2", color: "text-emerald-700" },
];

const TABLE_DATA = [
  { id: 1, kode: "INF-01", kodeBg: "bg-blue-50 text-blue-500", nama: "Infrastruktur", laporan: "1,245 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-500" },
  { id: 2, kode: "LNK-02", kodeBg: "bg-amber-50 text-amber-500", nama: "Lingkungan", laporan: "850 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-500" },
  { id: 3, kode: "KMN-03", kodeBg: "bg-pink-50 text-pink-500", nama: "Keamanan", laporan: "420 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-500" },
  { id: 4, kode: "KSN-04", kodeBg: "bg-emerald-50 text-emerald-600", nama: "Kesehatan", laporan: "310 Laporan", status: "Review", statusBg: "bg-amber-50 text-amber-500" },
  { id: 5, kode: "SSL-05", kodeBg: "bg-purple-50 text-purple-500", nama: "Sosial", laporan: "150 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-500" },
];

export default function CategoryStatsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Manajemen Kategori</h1>
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
          
          <DialogAddCategory />
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800  p-4 text-gray-400  dark:text-gray-100">No</TableCell>
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800  p-4 text-gray-400  dark:text-gray-100">Kode</TableCell>
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800  p-4 text-gray-400  dark:text-gray-100">Nama Kategori</TableCell>
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800  p-4 text-gray-400  dark:text-gray-100">Total Laporan</TableCell>
                <TableCell className="text-center text-xs font-semibold bg-gray-100 dark:bg-gray-800   p-4 text-gray-400  dark:text-gray-100">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {TABLE_DATA.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                >
                  <TableCell className="py-4 px-2   text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-4 px-2  ">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${row.kodeBg} dark:bg-opacity-10`}>
                      {row.kode}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 px-2   text-sm font-medium text-gray-700 dark:text-gray-200">
                    {row.nama}
                  </TableCell>

                  <TableCell className="py-4 px-2   text-sm text-gray-500 dark:text-gray-400">
                    {row.laporan}
                  </TableCell>

                
                  <TableCell className="py-4 px-2   text-right">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded-full p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-500/10">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
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