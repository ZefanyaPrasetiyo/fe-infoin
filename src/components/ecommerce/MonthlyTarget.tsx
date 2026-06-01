"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function KategoriDonutChart() {
  const series = [45, 25, 20, 10];
  
  const options: ApexOptions = {
   colors: ["#10b981", "#34d399", "#a7f3d0", "#cbd5e1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut", // Diubah jadi donut
      height: 330,
    },
    labels: ["Infrastruktur", "Lingkungan", "Keamanan", "Lainnya"],
    plotOptions: {
      pie: {
        donut: {
          size: "75%", // Mengatur ketebalan donut-nya
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              color: "#64748b",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "700",
              color: "#1d2939",
              offsetY: 10,
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Dominan",
              color: "#64748b",
              fontSize: "12px",
              // Menampilkan nilai dari data pertama (Infrastruktur) sebagai sorotan utama di tengah
              formatter: function (w) {
                return w.globals.series[0] + "%";
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false, // Dimatikan karena angkanya nanti numpuk, mending fokus ke teks di tengah donut
    },
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      colors: ["transparent"],
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Persentase Kategori
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Perbandingan jenis aduan masyarakat terbanyak
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative mt-6 flex justify-center">
          <div className="h-[300px] w-full max-w-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="donut" // Diubah jadi donut
              height={330}
            />
          </div>
        </div>
      </div>
    </div>
  );
}