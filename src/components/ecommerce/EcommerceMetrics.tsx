"use client";
import React from "react";
import { BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* bg diganti ke emerald soft, teks ikon jadi emerald utama */}
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl dark:bg-emerald-500/10">
          <GroupIcon className="text-emerald-600 size-6 dark:text-emerald-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Petugas
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              80
            </h4>
          </div>
        </div>
      </div>
      
      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* bg diganti ke emerald soft tingkat 2, teks ikon jadi emerald medium */}
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-100/70 rounded-xl dark:bg-emerald-400/10">
          <BoxIconLine className="text-emerald-500 size-6 dark:text-emerald-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Kategori
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5
            </h4>
          </div>
        </div>
      </div>

      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* bg diganti ke emerald pastel, teks ikon jadi emerald soft */}
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-200/50 rounded-xl dark:bg-emerald-300/10">
          <BoxIconLine className="text-emerald-400 size-6 dark:text-emerald-200" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Lokasi
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              45
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};