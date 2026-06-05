"use client";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";
import { DialogAddCategory } from "@/components/dialog/dialogCreateCategory/page";
import { getCategories, Category } from "@/lib/category";
import { useEffect, useState } from "react";
import DialogActionCategory from "@/components/dialog/dialogActionCategory/page";
import { Spinner } from "@/components/ui/spinner"; 

export default function CategoryStatsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchgCategory = async () => {
    try {
      setLoading(true); // Mulai efek loading
      const res = await getCategories();
      if (res && res.data) {
        setCategories(res.data);
      }
      console.log("======", res);
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchgCategory();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl rounded-md">
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Manajemen Kategori</h1>
          <button className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-8 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between dark:border-white/5">
          <div className="grid grid-cols-2 gap-8 md:flex md:gap-16">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-medium text-emerald-600">
                {categories.length}
              </span>
              <span className="mt-1 text-xs font-medium text-gray-400">Total Kategori</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-medium text-emerald-700">0</span>
              <span className="mt-1 text-xs font-medium text-gray-400">Ditambahkan Bulan Ini</span>
            </div>
          </div>
          
          <DialogAddCategory />
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 p-4 text-gray-400 dark:text-gray-100">No</TableCell>
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 p-4 text-gray-400 dark:text-gray-100">Kode</TableCell>
                <TableCell className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 p-4 text-gray-400 dark:text-gray-100">Nama Kategori</TableCell>
                <TableCell className="text-center text-xs font-semibold bg-gray-100 dark:bg-gray-800 p-4 text-gray-400 dark:text-gray-100">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Spinner className="h-5 w-5 animate-spin text-emerald-500" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                    Belum ada data kategori.
                  </td>
                </TableRow>
              ) : (
                categories.map((cat, index) => (
                  <TableRow 
                    key={cat.id} 
                    className="border-b border-gray-50/50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <TableCell className="py-4 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>

                    <TableCell className="py-4 px-2">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider dark:bg-opacity-10 bg-gray-100 dark:bg-gray-800">
                        {cat.kode_kategori}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 px-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {cat.nama}
                    </TableCell>

                    <TableCell className="py-4 px-2 text-right">
                      <DialogActionCategory category={cat} />
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