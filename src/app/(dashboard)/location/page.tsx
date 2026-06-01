"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search, MapPin, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogAddLocation } from "@/components/dialog/dialogCreateLoaction/page";

const STATS_DATA = [
  { label: "Total Wilayah / Kecamatan", value: "6", color: "text-blue-600" },
  { label: "Radius Kunci Default", value: "5 KM", color: "text-emerald-600" },
];

const LOKASI_DUMMY = [
  { id: 1, nama: "Cibinong", lat: "-6.4833", long: "106.8500", radius: "5 KM" },
  { id: 2, nama: "Bojonggede", lat: "-6.4912", long: "106.7944", radius: "5 KM" },
  { id: 3, nama: "Citeureup", lat: "-6.4906", long: "106.8742", radius: "5 KM" },
  { id: 4, nama: "Babakan Madang", lat: "-6.5594", long: "106.8711", radius: "7 KM" },
  { id: 5, status: "Sukuraja", nama: "Sukaraja", lat: "-6.5706", long: "106.8361", radius: "5 KM" },
];

export default function MasterLokasiPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md p-8">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Master Data Wilayah</h1>
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
          
          <DialogAddLocation />
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableCell className="w-16 p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-l-xl">No</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Nama Wilayah / Kecamatan</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Latitude Pusat</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Longitude Pusat</TableCell>
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Batas Radius Kunci</TableCell>
                <TableCell className="p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-r-xl">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {LOKASI_DUMMY.map((row, index) => (
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

                  <TableCell className="py-4 px-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                    {row.lat}
                  </TableCell>

                  <TableCell className="py-4 px-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                    {row.long}
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {row.radius}
                    </span>
                  </TableCell>
                
                  <TableCell className="py-4 px-4 text-right">
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