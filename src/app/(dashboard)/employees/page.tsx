"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search, Edit2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogAddEmployee } from "@/components/dialog/dialogCreateEmployee/page";

const STATS_DATA = [
  { label: "Total Petugas", value: "45", color: "text-blue-600" },
  { label: "Petugas Aktif", value: "42", color: "text-emerald-600" },
];

const PETUGAS_DUMMY = [
  { id: 1, nama: "Ahmad Fauzi", email: "ahmad.f@dinas.go.id", telp: "081234567890", daerah: "Kec. Cibinong", avatarBg: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
  { id: 2, nama: "Budi Santoso", email: "budi.s@dinas.go.id", telp: "081298765432", daerah: "Kec. Bojonggede", avatarBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
  { id: 3, nama: "Citra Lestari", email: "citra.l@dinas.go.id", telp: "085612349876", daerah: "Kec. Citeureup", avatarBg: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400" },
  { id: 4, nama: "Dian Pratama", email: "dian.p@dinas.go.id", telp: "081122334455", daerah: "Kec. Babakan Madang", avatarBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
  { id: 5, nama: "Eko Wijaya", email: "eko.w@dinas.go.id", telp: "087855667788", daerah: "Kec. Sukaraja", avatarBg: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" },
];

export default function PetugasPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md p-8">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Manajemen Petugas</h1>
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
          
          <DialogAddEmployee />
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableCell className="w-16 p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-l-xl">No</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Nama Petugas</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Email</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">No Telp</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Daerah Dinas</TableCell>
                <TableCell className="p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-r-xl">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {PETUGAS_DUMMY.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                >
                  <TableCell className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${row.avatarBg}`}>
                        {row.nama.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {row.nama}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {row.email}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {row.telp}
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {row.daerah}
                    </span>
                  </TableCell>
                
                  <TableCell className="py-4 px-4 text-right">
                    <div className="flex items-center justify-center gap-2">
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