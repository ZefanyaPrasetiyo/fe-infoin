"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { SlidersHorizontal } from "lucide-react";

interface Laporan {
  id: number;
  kode: string;
  user: string;
  kategori: string;
  tanggal: string;
  status: "Selesai" | "Proses" | "Menunggu";
}

const tableData: Laporan[] = [
  {id: 1, kode: "LPR-001", user: "Budi Santoso", kategori: "Infrastruktur", tanggal: "20 Mei 2026", status: "Selesai" },
  {id: 2, kode: "LPR-002", user: "Siti Aminah", kategori: "Keamanan", tanggal: "19 Mei 2026", status: "Proses" },
  {id: 3, kode: "LPR-003", user: "Agus Salim", kategori: "Lingkungan", tanggal: "18 Mei 2026", status: "Menunggu" },
];

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Laporan Terbaru
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-7xl w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kode
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pelapor
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kategori
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tanggal
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((report) => (
              <TableRow key={report.id} className="">
                <TableCell className="py-4 text-sm font-bold text-blue-600">
                  {report.id}
                </TableCell>
                <TableCell className="py-4 text-sm font-bold text-blue-600">
                  {report.kode}
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                  {report.user}
                </TableCell>
                <TableCell className="py-4 text-sm text-gray-500 dark:text-gray-400">
                  {report.kategori}
                </TableCell>
                <TableCell className="py-4 text-sm text-gray-500 dark:text-gray-400">
                  {report.tanggal}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    size="sm"
                    color={
                      report.status === "Selesai"
                        ? "success"
                        : report.status === "Proses"
                        ? "primary"
                        : "warning"
                    }
                  >
                    {report.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}