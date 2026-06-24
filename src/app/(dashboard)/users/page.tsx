"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Search, Ban, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUsers, User } from "@/lib/user";
import { useSession } from "next-auth/react";

export default function MasyarakatPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const fetchMasyarakat = async () => {
      setLoading(true);
      try {
        const res = await getUsers();
        if (res.success || res.data) {
          const allUsers = res.data || res;
          const masyarakatOnly = allUsers.filter((u: User) => u.role === "user");
          setUsers(masyarakatOnly);
        } else {
          toast.error("Gagal memuat data masyarakat");
        }
      } catch (error) {
        console.error("Error fetch users:", error);
        toast.error("Terjadi kesalahan pada server");
      } finally {
        setLoading(false);
      }
    };

    fetchMasyarakat();
  }, []);

  const totalMasyarakat = users.length;
  const akunAktif = users.filter((u) => !u.deleted_at).length;

  const STATS_DATA = [
    { label: "Total Masyarakat", value: totalMasyarakat.toLocaleString(), color: "text-blue-600" },
    { label: "Akun Aktif", value: akunAktif.toLocaleString(), color: "text-emerald-600" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md p-8">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Data Masyarakat (User)</h1>
          <button className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
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
                <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 text-center">Status</TableCell>
                <TableCell className="p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-r-xl">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                      <span className="text-sm">Memuat data masyarakat...</span>
                    </div>
                  </td>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="h-48 text-center text-sm text-slate-500">
                    Belum ada data masyarakat terdaftar.
                  </td>
                </TableRow>
              ) : (
                paginatedUsers.map((row, index) => {
                  const isOnline = session?.user?.id === row.id;
                  const isSuspended = !!row.deleted_at;
                  
                  let statusText = "";
                  let statusBg = "";

                  if (isSuspended) {
                    statusText = "Ditangguhkan";
                    statusBg = "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
                  } else if (isOnline) {
                    statusText = "Online";
                    statusBg = "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
                  } else {
                    statusText = "Offline";
                    statusBg = "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400";
                  }

                  return (
                    <TableRow 
                      key={row.id} 
                      className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </TableCell>

                      <TableCell className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {row.nama_panjang}
                        {isOnline && <span className="ml-2 text-[10px] text-blue-500 font-normal"></span>}
                      </TableCell>

                      <TableCell className="py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {row.email}
                      </TableCell>

                      <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {row.nomor_telepon || "-"}
                      </TableCell>

                      <TableCell className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${statusBg}`}>
                          {statusText}
                        </span>
                      </TableCell>
                    
                      <TableCell className="py-4 px-4 text-right">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className={`rounded-full p-2 transition-colors ${
                              isOnline 
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 cursor-pointer"
                            }`}
                            title={isSuspended ? "Aktifkan Kembali" : "Suspend Akun"}
                            disabled={isOnline}
                          >
                            {isSuspended ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Ban className="h-4 w-4" />}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && users.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {Math.min(pageSize, users.length - (currentPage - 1) * pageSize)} dari {users.length} pengguna
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