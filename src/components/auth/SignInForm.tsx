"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // 🚨 Import fungsi signIn dari NextAuth
import { toast } from "sonner";
import { Loader2, ChevronLeft, Eye, EyeOff } from "lucide-react";

import Checkbox from "@/components/form/input/Checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      // 🚨 Panggil NextAuth signIn dengan provider "credentials"
      const res = await signIn("credentials", {
        redirect: false, // Jangan auto-redirect biar kita bisa nangkep errornya
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        toast.error("Login gagal. Pastikan email dan password benar.");
      } else if (res?.ok) {
        toast.success("Login berhasil! Mengalihkan...");
        router.push("/dashboard"); // Arahkan ke halaman utama lu
        router.refresh(); // Refresh router biar session NextAuth langsung kebaca
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar px-4 sm:px-8">
      {/* Tombol Kembali */}
      <div className="w-full max-w-md pt-6 sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-normal text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Kontainer Utama */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto pb-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-medium text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Masuk
            </h1>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400 leading-relaxed">
              Silahkan masuk untuk melihat informasi terpercaya dan relevan di sekitar anda.
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                
                {/* 1. Input Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@gmail.com" 
                    required
                    disabled={loading}
                    className="font-normal"
                  />
                </div>

                {/* 2. Input Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-normal text-xs text-gray-700 dark:text-gray-300">
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password anda"
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

                {/* 3. Checkbox Ingat Saya & Lupa Password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      className="w-4 h-4 rounded border-gray-300" 
                      checked={isChecked} 
                      onChange={setIsChecked} 
                      disabled={loading}
                    />
                    <span className="block font-normal text-xs text-gray-600 dark:text-gray-400">
                      Ingat Saya
                    </span>
                  </div>
                  {/* <Link
                    href="/reset-password"
                    className="text-xs font-normal text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
                  >
                    Lupa password?
                  </Link> */}
                </div>

                {/* 4. Tombol Submit */}
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 font-normal text-sm transition-colors flex items-center justify-center gap-2 h-11" 
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memproses Masuk...
                      </>
                    ) : (
                      "Masuk"
                    )}
                  </Button>
                </div>

              </div>
            </form>

            <div className="mt-6 border-t border-gray-100 dark:border-white/5 pt-5">
              <p className="text-sm font-normal text-center text-gray-600 dark:text-gray-400 sm:text-start">
                Tidak memiliki akun?{" "}
                <Link
                  href="/register"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium ml-1 transition-colors"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}