"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search, Ban, CheckCircle } from "lucide-react";

const STATS_DATA = [
  { label: "Total Masyarakat", value: "1,420", color: "text-blue-600" },
  { label: "Akun Aktif", value: "1,412", color: "text-emerald-600" },
];

const USER_DUMMY = [
  { id: 1, nama: "Rian Hidayat", email: "rian.hid@gmail.com", telp: "081244556677", laporanCount: "12 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { id: 2, nama: "Dewi Lestari", email: "dewi.les@gmail.com", telp: "087899001122", laporanCount: "5 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { id: 3, nama: "Ferry Darmawan", email: "ferry.d@yahoo.com", telp: "085633445566", laporanCount: "2 Laporan", status: "Ditangguhkan", statusBg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  { id: 4, nama: "Yulia Putri", email: "yulia.putri@gmail.com", telp: "081388776655", laporanCount: "0 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { id: 5, nama: "Hendra Wijaya", email: "hendra.w@gmail.com", telp: "089644552211", laporanCount: "8 Laporan", status: "Aktif", statusBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
];

export default function MasyarakatPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md p-8">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Data Masyarakat (User)</h1>
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
                <TableCell className="w-16 p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-l-xl">No</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Nama Lengkap</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Email</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">No Telp</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Aktivitas</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 text-center">Status</TableCell>
                <TableCell className="p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-r-xl">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {USER_DUMMY.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                >
                  <TableCell className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {row.nama}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {row.email}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {row.telp}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {row.laporanCount}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${row.statusBg}`}>
                      {row.status}
                    </span>
                  </TableCell>
                
                  <TableCell className="py-4 px-4 text-right">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        title={row.status === "Aktif" ? "Suspend Akun" : "Aktifkan Kembali"}
                      >
                        {row.status === "Aktif" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
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