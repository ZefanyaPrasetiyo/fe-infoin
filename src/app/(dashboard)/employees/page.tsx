"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Search, Trash2, Edit2 } from "lucide-react"; 
import { DialogAddEmployee } from "@/components/dialog/dialogCreateEmployee/page";
import { useState, useEffect } from "react";
import { getUsers, User } from "@/lib/user";
import { getLocations, Location } from "@/lib/location";
import { Spinner } from "@/components/ui/spinner"; 
import DialogActionUser from "@/components/dialog/dialogActionUser/page";
import { useSession } from "next-auth/react";

export default function PetugasPage() {
    const session = useSession()
  console.log("=======", session)
  const [petugasData, setPetugasData] = useState<User[]>([]);
  const [lokasiData, setLokasiData] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(petugasData.length / pageSize));
  const paginatedPetugas = petugasData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resUsers, resLokasi] = await Promise.all([
        getUsers(),
        getLocations()
      ]);

      if (resUsers && resUsers.data) {
        const hanyaPetugas = resUsers.data.filter((u: User) => u.role === "petugas");
        setPetugasData(hanyaPetugas);
      }
      
      if (resLokasi && resLokasi.data) {
        setLokasiData(resLokasi.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNamaLokasi = (id_location: string) => {
    const lokasi = lokasiData.find(loc => loc.id === id_location);
    return lokasi ? lokasi.nama_lokasi : "Lokasi Tidak Diketahui";
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Manajemen Petugas</h1>
          <button className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-8 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between dark:border-white/5">
          <div className="grid grid-cols-2 gap-8 md:flex md:gap-16">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-medium text-blue-600">
                {petugasData.length}
              </span>
              <span className="mt-1 text-xs font-medium text-gray-400">Total Petugas</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-medium text-emerald-600">
                {petugasData.length}
              </span>
              <span className="mt-1 text-xs font-medium text-gray-400">Petugas Aktif</span>
            </div>
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
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Spinner className="h-5 w-5 animate-spin text-emerald-500" />
                      <span className="text-sm">Memuat data petugas...</span>
                    </div>
                  </td>
                </TableRow>
              ) : petugasData.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    Belum ada data petugas yang terdaftar.
                  </td>
                </TableRow>
              ) : (
                paginatedPetugas.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <TableCell className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </TableCell>

                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(index)}`}>
                          {row.nama_panjang.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {row.nama_panjang}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {row.email}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {row.nomor_telepon || "-"}
                    </TableCell>

                    <TableCell className="py-4 px-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {getNamaLokasi(row.id_location)}
                      </span>
                    </TableCell>
                  
                    <TableCell className="py-4 px-4 text-right">
                      <DialogActionUser user={row} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && petugasData.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {Math.min(pageSize, petugasData.length - (currentPage - 1) * pageSize)} dari {petugasData.length} petugas
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))}
            />
          </div>
        )}
      </div>
    </div>
  );
}