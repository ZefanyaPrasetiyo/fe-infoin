"use client";

import React, { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon } from "@/icons";
import { getUsers, User } from "@/lib/user";
import { getCategories } from "@/lib/category";
import { getLocations } from "@/lib/location";

export const EcommerceMetrics = () => {
  const [petugasCount, setPetugasCount] = useState<number>(0);
  const [kategoriCount, setKategoriCount] = useState<number>(0);
  const [lokasiCount, setLokasiCount] = useState<number>(0);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [usersRes, categoriesRes, locationsRes] = await Promise.all([
          getUsers(),
          getCategories(),
          getLocations(),
        ]);

        if (usersRes?.success && Array.isArray(usersRes.data)) {
          const petugas = usersRes.data.filter(
            (user: User) => user.role === "petugas"
          );
          setPetugasCount(petugas.length);
        }

        if (categoriesRes?.success && Array.isArray(categoriesRes.data)) {
          setKategoriCount(categoriesRes.data.length);
        }

        if (locationsRes?.success && Array.isArray(locationsRes.data)) {
          setLokasiCount(locationsRes.data.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl dark:bg-emerald-500/10">
          <GroupIcon className="text-emerald-600 size-6 dark:text-emerald-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Petugas</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {petugasCount}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-100/70 rounded-xl dark:bg-emerald-400/10">
          <BoxIconLine className="text-emerald-500 size-6 dark:text-emerald-300" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Kategori</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {kategoriCount}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-200/50 rounded-xl dark:bg-emerald-300/10">
          <BoxIconLine className="text-emerald-400 size-6 dark:text-emerald-200" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Lokasi</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {lokasiCount}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};