"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Search, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getReports, Report } from "@/lib/report";
import { getCategories, Category } from "@/lib/category";
import { getUsers, User } from "@/lib/user";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import DialogActionReports from "@/components/dialog/dialogactionReports/page";

function statusBadge(status: string) {
  switch (status) {
    case "disetujui":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "diproses":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "ditolak":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    case "menunggu":
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
  }
}

export default function MasterLaporanPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(reports.length / pageSize));
  const paginatedReports = reports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<"detail" | "disetujui" | "ditolak" | null>(null);

  useEffect(() => {
    if (!session?.user?.id_location) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [resReports, resCategories, resUsers] = await Promise.all([
          getReports(),
          getCategories(),
          getUsers()
        ]);

        if (resReports.success) {
          const filteredReports = resReports.data.filter(
            (r: any) => (r.detail?.id_location || r.id_location) === session.user.id_location
          );
          setReports(filteredReports);
        }
        
        if (resCategories.success) setCategories(resCategories.data);
        if (resUsers.success) setUsers(resUsers.data);

      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [session]);

  const STATS_DATA = [
    { label: "Total Laporan", value: reports.length, color: "text-indigo-500" },
    { label: "Menunggu", value: reports.filter((r) => r.status === "menunggu").length, color: "text-amber-500" },
    { label: "Diproses", value: reports.filter((r) => r.status === "diproses").length, color: "text-blue-500" },
    { label: "Disetujui", value: reports.filter((r) => r.status === "disetujui").length, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-7xl rounded-2xl p-6">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-normal text-gray-800 dark:text-white">Validasi Laporan Masuk</h1>
          <button className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-8 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between dark:border-white/5">
          <div className="grid grid-cols-2 gap-8 md:flex md:gap-16">
            {STATS_DATA.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className={`text-3xl md:text-4xl font-light ${stat.color}`}>
                  {loading ? "-" : stat.value}
                </span>
                <span className="mt-1 text-xs font-normal text-gray-500">
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
                <TableCell className="pb-4 text-center text-sm font-medium text-gray-400 dark:text-gray-500 w-16">No</TableCell>
                <TableCell className="pb-4 text-sm font-medium text-gray-400 dark:text-gray-500">Kode Laporan</TableCell>
                <TableCell className="pb-4 text-sm font-medium text-gray-400 dark:text-gray-500">Judul Laporan</TableCell>
                <TableCell className="pb-4 text-sm font-medium text-gray-400 dark:text-gray-500">Pelapor</TableCell>
                <TableCell className="pb-4 text-sm font-medium text-gray-400 dark:text-gray-500">Kategori</TableCell>
                <TableCell className="pb-4 text-center text-sm font-medium text-gray-400 dark:text-gray-500">Status</TableCell>
                <TableCell className="pb-4 text-center text-sm font-medium text-gray-400 dark:text-gray-500">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={7} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-normal">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                      Memuat data...
                    </div>
                  </td>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="h-32 text-center text-sm font-normal text-gray-500">
                    Belum ada laporan yang masuk di wilayah Anda.
                  </td>
                </TableRow>
              ) : (
                paginatedReports.map((row, index) => {
                  const userMatch = users.find((u) => u.id === row.id_user);
                  const categoryMatch = categories.find((c) => c.id === row.id_kategori);

                  return (
                    <TableRow 
                      key={row.id} 
                      className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                    >
                      <TableCell className="py-4 px-2 text-center text-sm font-normal text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </TableCell>

                      <TableCell className="py-4 px-2 text-sm font-normal text-gray-700 dark:text-gray-200">
                        {row.kode_report}
                      </TableCell>

                      <TableCell className="py-4 px-2 text-sm font-normal text-gray-700 dark:text-gray-200">
                        {row.judul_laporan}
                      </TableCell>

                      <TableCell className="py-4 px-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                        <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
                          {userMatch ? userMatch.nama_panjang : "User Tidak Ditemukan"}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 px-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                        <span>
                          {categoryMatch ? categoryMatch.nama || (categoryMatch as any).nama : "Umum"}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 px-2 text-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-normal capitalize ${statusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </TableCell>
                    
                      <TableCell className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          <button 
                            onClick={() => {
                              setSelectedReport(row);
                              setActionType("detail");
                            }}
                            title="Lihat Detail"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button 
                            onClick={() => {
                              if (row.status === "menunggu") {
                                setSelectedReport(row);
                                setActionType("disetujui");
                              }
                            }}
                            disabled={row.status !== "menunggu"}
                            title={row.status === "menunggu" ? "Setujui Laporan" : "Laporan sudah diproses"}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              row.status === "menunggu" 
                                ? "text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 cursor-pointer" 
                                : "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>

                          <button 
                            onClick={() => {
                              if (row.status === "menunggu") {
                                setSelectedReport(row);
                                setActionType("ditolak");
                              }
                            }}
                            disabled={row.status !== "menunggu"}
                            title={row.status === "menunggu" ? "Tolak Laporan" : "Laporan sudah diproses"}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              row.status === "menunggu" 
                                ? "text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 cursor-pointer" 
                                : "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                            }`}
                          >
                            <XCircle className="h-4 w-4" />
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
        {!loading && reports.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {Math.min(pageSize, reports.length - (currentPage - 1) * pageSize)} dari {reports.length} laporan
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))}
            />
          </div>
        )}
      </div>

      <DialogActionReports 
        report={selectedReport}
        actionType={actionType}
        onClose={() => {
          setSelectedReport(null);
          setActionType(null);
        }}
        onSuccess={(id, status, catatan) => {
          setReports((prev) => prev.map((r) => r.id === id ? { ...r, status, catatan } : r));
        }}
      />

    </div>
  );
}