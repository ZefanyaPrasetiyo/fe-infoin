"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getReports, Report } from "@/lib/report";
import { getUsers, User } from "@/lib/user";
import { getCategories, Category } from "@/lib/category";

interface Laporan {
  id: string;
  kode: string;
  user: string;
  kategori: string;
  tanggal: string;
  status: "Selesai" | "Proses" | "Menunggu" | "Ditolak";
}

const statusMap: Record<string, Laporan["status"]> = {
  disetujui: "Selesai",
  diproses: "Proses",
  menunggu: "Menunggu",
  ditolak: "Ditolak",
};

export default function RecentOrders() {
  const [tableData, setTableData] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentReports() {
      setLoading(true);
      try {
        const [reportsRes, usersRes, categoriesRes] = await Promise.all([
          getReports(),
          getUsers(),
          getCategories(),
        ]);

        if (
          reportsRes?.success &&
          Array.isArray(reportsRes.data) &&
          usersRes?.success &&
          Array.isArray(usersRes.data) &&
          categoriesRes?.success &&
          Array.isArray(categoriesRes.data)
        ) {
          const usersById = new Map<string, string>();
          usersRes.data.forEach((user: User) => {
            usersById.set(user.id, user.nama_panjang);
          });

          const categoriesById = new Map<string, string>();
          categoriesRes.data.forEach((category: Category) => {
            categoriesById.set(String(category.id), category.nama || (category as any).nama);
          });

          const recentData = reportsRes.data
            .slice()
            .sort((a: Report, b: Report) => {
              const dateA = new Date(a.created_at || a.updated_at || "").getTime();
              const dateB = new Date(b.created_at || b.updated_at || "").getTime();
              return dateB - dateA;
            })
            .slice(0, 5)
            .map((report: Report) => {
              const createdDate = new Date(report.created_at || report.updated_at || "");
              const formattedDate = Number.isNaN(createdDate.getTime())
                ? "-"
                : new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(createdDate);

              return {
                id: report.id,
                kode: report.kode_report || "-",
                user: usersById.get(report.id_user) || "Unknown",
                kategori: categoriesById.get(String(report.id_kategori)) || "Umum",
                tanggal: formattedDate,
                status: statusMap[report.status] || "Menunggu",
              };
            });

          setTableData(recentData);
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentReports();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-[#111c2d] sm:px-6">
      <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Laporan Terbaru
          </h3>
        </div>

      
      </div>
      
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableCell className="w-16 p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-l-xl">No</TableCell>
              <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Kode Laporan</TableCell>
              <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Pelapor</TableCell>
              <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Kategori</TableCell>
              <TableCell className="p-4 text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400">Tanggal</TableCell>
              <TableCell className="p-4 text-center text-xs font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 rounded-r-xl">Status</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                    <span className="text-sm">Memuat laporan terbaru...</span>
                  </div>
                </td>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="h-48 text-center text-sm text-slate-500">
                  Belum ada laporan terbaru.
                </td>
              </TableRow>
            ) : (
              tableData.map((report, index) => (
                <TableRow 
                  key={report.id} 
                  className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                >
                  <TableCell className="py-4 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {report.kode}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {report.user}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {report.kategori}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {report.tanggal}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 text-center">
                    <Badge
                      size="sm"
                      color={
                        report.status === "Selesai"
                          ? "success"
                          : report.status === "Proses"
                          ? "primary"
                          : report.status === "Menunggu"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}