"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
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

const wilayahOptions = [
  { value: "cibinong", label: "Kec. Cibinong" },
  { value: "bojonggede", label: "Kec. Bojonggede" },
];

export function DialogAddEmployee() {
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telp, setTelp] = useState("");
  const [password, setPassword] = useState("");
  const [daerah, setDaerah] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nama,
      email,
      no_telp: telp,
      password,
      daerah_id: daerah,
    };

    console.log("Data Petugas Baru:", payload);

    setNama("");
    setEmail("");
    setTelp("");
    setPassword("");
    setDaerah("");
    setOpen(false);
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
              value={nama}
              onChange={(e) => setNama(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={telp}
                onChange={(e) => setTelp(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-gray-800 dark:focus:border-emerald-500"
            />
          </Field>

          <Field>
            <FieldLabel className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Wilayah Penempatan Dinas
            </FieldLabel>
            <Select required value={daerah}>
              <SelectTrigger className="w-full h-[42px] rounded-xl border border-gray-200 bg-transparent px-4 text-sm outline-none focus:border-emerald-500 dark:border-gray-800">
                <SelectValue placeholder="Pilih Kecamatan Tugas" />
              </SelectTrigger>
              <SelectContent className="z-99999 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
               {wilayahOptions.map((option)=>(
                 <SelectItem key={option.value} value={option.value}>
                   {option.label}
                 </SelectItem>
               ))}
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