import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    // Grid utama untuk membungkus seluruh konten dashboard
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      {/* 1. Baris Atas Kiri: Metrics Cards (Petugas, Kategori, Lokasi) */}
      <div className="col-span-12 xl:col-span-7 space-y-6">
        <EcommerceMetrics />

        {/* 2. Baris Tengah Kiri: Bar Chart */}
        <MonthlySalesChart />
      </div>

      {/* 3. Baris Atas Kanan: Donut Chart Persentase Kategori */}
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      {/* 4. Baris Bawah: Tabel Laporan Terbaru */}
      {/* Kasih col-span-12 biar dia makan semua jatah kolom dan langsung melar sempurna */}
      <div className="col-span-12 w-full mt-2">
        <RecentOrders />
      </div>

    </div>
  );
}