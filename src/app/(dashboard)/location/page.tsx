"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search, MapPin, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogAddLocation } from "@/components/dialog/dialogCreateLoaction/page";
import { useState, useEffect } from "react";
import { getLocations, Location } from "@/lib/location"; // Sesuaikan path jika perlu
import { Spinner } from "@/components/ui/spinner"; // Pastikan komponen spinner ada
import DialogActionLocation from "@/components/dialog/dialogActionLocation/page"; // Pastikan path ini benar

export default function MasterLokasiPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await getLocations();
      if (res && res.data) {
        setLocations(res.data);
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

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
             <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-medium text-blue-600">
                  {locations.length}
                </span>
                <span className="mt-1 text-xs font-medium text-gray-400">
                  Total Wilayah / Kecamatan
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-medium text-emerald-600">
                  5 KM
                </span>
                <span className="mt-1 text-xs font-medium text-gray-400">
                  Radius Kunci Default
                </span>
              </div>
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
              {loading ? (
                 <TableRow>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Spinner className="h-5 w-5 animate-spin text-emerald-500" />
                      <span className="text-sm">Memuat data wilayah...</span>
                    </div>
                  </td>
                </TableRow>
              ) : locations.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    Belum ada data wilayah. Silakan tambah baru!
                  </td>
                </TableRow>
              ) : (
                locations.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <TableCell className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {row.nama_lokasi}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                      {row.latitude}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                      {row.longitude}
                    </TableCell>

                    <TableCell className="py-4 px-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {row.radius_km} KM
                      </span>
                    </TableCell>
                  
                    <TableCell className="py-4 px-4 text-right">
                     <DialogActionLocation location={row} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
      </div>
    </div>
  );
}