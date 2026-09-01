"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Perbaiki path button biar konsisten
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getLocations, Location } from "@/lib/location";
import { registerUser } from "@/lib/auth"; 

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState<Location[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        
        if (res.success) {
          setLocation(res.data); 
        } else {
          console.error("Gagal dapet lokasi:", res.message);
        }
      } catch (error) {
        console.error("Error dari server:", error);
      }
    };

    fetchLocations();
  }, []);

  const [formData, setFormData] = useState({
    nama_panjang: "",
    email: "",
    password: "",
    nomor_telepon: "",
    id_location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler khusus untuk komponen Select dari shadcn
  const handleSelectLocation = (value: string | null) => {
    setFormData({
      ...formData,
      id_location: value ?? "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      toast.error("Anda harus menyetujui Syarat dan Ketentuan terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        ...formData,
        role: "user", 
      });

      toast.success(res.message || "Pendaftaran berhasil! Silakan cek email.");
      
      // Reset form setelah sukses
      setFormData({ nama_panjang: "", email: "", password: "", nomor_telepon: "", id_location: "" });
      setIsChecked(false);
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar px-4 sm:px-8">
      <div className="w-full max-w-md pt-6 sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-normal text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto pb-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-medium text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daftar
            </h1>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Daftarkan akun anda untuk masuk
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                
                <div className="space-y-1.5">
                  <Label htmlFor="nama_panjang" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Nama Lengkap<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="nama_panjang"
                    name="nama_panjang"
                    value={formData.nama_panjang}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                    className="font-normal"
                  />
                </div>

                {/* 2. Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="font-normal"
                  />
                </div>

                {/* 3. Nomor Telepon */}
                <div className="space-y-1.5">
                  <Label htmlFor="nomor_telepon" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Nomor Telepon<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    id="nomor_telepon"
                    name="nomor_telepon"
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                    className="font-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="id_location" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Wilayah Tinggal<span className="text-error-500">*</span>
                  </Label>
                  <Select 
                    value={formData.id_location} 
                    onValueChange={handleSelectLocation}
                    disabled={loading}
                    required
                  >
                    <SelectTrigger className="w-full font-normal text-sm text-gray-500 dark:text-gray-400">
                      <SelectValue placeholder="Pilih wilayah kelurahan/kecamatan" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectGroup>
                        {location.length === 0 ? (
                          <SelectItem value="loading" disabled className="font-normal text-sm text-gray-400">
                            Memuat data wilayah...
                          </SelectItem>
                        ) : (
                          location.map((l) => (
                            <SelectItem key={l.id} value={String(l.id)} className="font-normal text-sm">
                              {l.nama_lokasi}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password (min 8 characters)"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={loading}
                      className="font-normal pr-12"
                    />
                    <span
                      onClick={() => !loading && setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 p-1"
                    >
                      {showPassword ? (
                        <Eye className="text-gray-500 dark:text-gray-400 h-4 w-4 transition-colors hover:text-gray-700 dark:hover:text-gray-300" />
                      ) : (
                        <EyeOff className="text-gray-500 dark:text-gray-400 h-4 w-4 transition-colors hover:text-gray-700 dark:hover:text-gray-300" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Persetujuan Checkbox */}
                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    className="w-5 h-5 shrink-0 rounded border-gray-300 mt-0.5"
                    checked={isChecked}
                    onChange={setIsChecked}
                    disabled={loading}
                  />
                  <p className="inline-block font-normal text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90 hover:underline cursor-pointer">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-normal text-white transition rounded-lg bg-emerald-500 shadow-theme-xs hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memproses Pendaftaran...
                      </>
                    ) : (
                      "Daftar"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5 border-t border-gray-100 dark:border-white/5 pt-4">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Sudah mempunyai akun?{" "}
                <Link
                  href="/login"
                  className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}