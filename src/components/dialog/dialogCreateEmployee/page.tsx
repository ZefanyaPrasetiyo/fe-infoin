"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { getLocations, Location } from "@/lib/location"; 
import { createUser, UserPayload } from "@/lib/user";
import { toast } from "sonner"; // Pastikan sonner terinstall

interface formData {
  nama: string;
  email: string;
  no_telp: string;
  password: string;
  daerah_id: string;
}

export function DialogAddEmployee() {
  const [open, setOpen] = useState(false);
  const [lokasi, setLokasi] = useState<Location[]>([]);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [form, setForm] = useState<formData>({
    nama: "",
    email: "",
    no_telp: "",
    password: "",
    daerah_id: "",
  });

  // Fetch lokasi saat dialog dibuka
  useEffect(() => {
    if (open && lokasi.length === 0) {
      const fetchLokasi = async () => {
        setLoadingLokasi(true);
        try {
          const res = await getLocations();
          if (res && res.data) {
            setLokasi(res.data);
          }
        } catch (error) {
          console.error("Gagal mengambil data lokasi", error);
        } finally {
          setLoadingLokasi(false);
        }
      };
      fetchLokasi();
    }
  }, [open, lokasi.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UserPayload = {
      nama_panjang: form.nama,
      email: form.email,
      nomor_telepon: form.no_telp,
      password: form.password,
      id_location: form.daerah_id,
      role: "petugas" // Default role sesuai form "Tambah Petugas"
    };

    const createPromise = createUser(payload).then((res) => {
        if (res && res.success === false) {
            throw new Error(res.message || "Gagal mendaftarkan petugas");
        }
        
        setOpen(false);
        setForm({
            nama: "",
            email: "",
            no_telp: "",
            password: "",
            daerah_id: "",
        });

        setTimeout(() => {
            window.location.reload();
        }, 1000);

        return res;
    });

    toast.promise(createPromise, {
        loading: "Mendaftarkan petugas baru...",
        success: "Petugas berhasil didaftarkan!",
        error: "Gagal mendaftarkan petugas"
    }, {
        position: "top-right"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button className="h-10 rounded-full bg-emerald-600 px-6 font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Petugas
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Tambah Petugas Baru
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Daftarkan akun petugas dinas baru beserta penempatan wilayah kerjanya.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Field>
            <FieldLabel className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Nama Lengkap
            </FieldLabel>
            <Input
              type="text"
              required
              placeholder="Contoh: Ahmad Fauzi"
              value={form.nama}
              onChange={(e) => setForm({...form, nama: e.target.value})}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-gray-800 dark:focus:border-emerald-500"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email Kerja
              </FieldLabel>
              <Input
                type="email"
                required
                placeholder="ahmad@dinas.go.id"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-gray-800 dark:focus:border-emerald-500"
              />
            </Field>

            <Field>
              <FieldLabel className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                No. Telepon / WhatsApp
              </FieldLabel>
              <Input
                type="tel"
                required
                placeholder="08123456789"
                value={form.no_telp}
                onChange={(e) => setForm({...form, no_telp: e.target.value})}
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-gray-800 dark:focus:border-emerald-500"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Kata Sandi Akun
            </FieldLabel>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-gray-800 dark:focus:border-emerald-500"
            />
          </Field>

          <Field>
            <FieldLabel className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Wilayah Penempatan Dinas
            </FieldLabel>
            <Select required value={form.daerah_id} onValueChange={(value) => setForm({...form, daerah_id: value})}>
              <SelectTrigger className="w-full h-[42px] rounded-xl border border-gray-200 bg-transparent px-4 text-sm outline-none focus:border-emerald-500 dark:border-gray-800">
                <SelectValue placeholder={loadingLokasi ? "Memuat..." : "Pilih Kecamatan Tugas"} />
              </SelectTrigger>
              <SelectContent className="z-999 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
               {lokasi.length > 0 ? (
                 lokasi.map((option) => (
                   <SelectItem key={option.id} value={option.id}>
                     {option.nama_lokasi}
                   </SelectItem>
                 ))
               ) : (
                 <SelectItem value="none" disabled>Belum ada data wilayah</SelectItem>
               )}
              </SelectContent>
            </Select>
          </Field>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <DialogClose >
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-gray-200 font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Daftarkan Petugas
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}