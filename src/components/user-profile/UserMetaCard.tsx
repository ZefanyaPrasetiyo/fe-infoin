"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useSession } from "next-auth/react";
import { MapPin, ShieldCheck, PenSquare } from "lucide-react";
import { getLocations } from "@/lib/location"; // 🚨 Sesuaikan path ini

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { data: session } = useSession();

  const userName = (session?.user as any)?.nama_panjang || session?.user?.name || "User";
  const userRole = (session?.user as any)?.role || "user";
  const userLocationId = (session?.user as any)?.id_location;

  const [locationName, setLocationName] = useState(userLocationId || "Belum ada lokasi");

  // Logika buat mapping id_location jadi nama lokasi
  useEffect(() => {
    const fetchLocation = async () => {
      if (userLocationId && (userRole === "admin" || userRole === "petugas")) {
        try {
          const res = await getLocations();
          if (res.success) {
            // Cari lokasi yang id-nya cocok
            const loc = res.data.find((l: any) => l.id === userLocationId);
            if (loc) {
              setLocationName(loc.nama_lokasi || loc.nama || userLocationId);
            }
          }
        } catch (error) {
          console.error("Gagal get lokasi:", error);
        }
      }
    };
    fetchLocation();
  }, [userLocationId, userRole]);

  const initialName = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <>
      {/* HEADER CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111c2d]">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10"></div>

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            
            {/* Avatar Modern dengan Gradient */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-2xl font-bold text-white shadow-lg ring-4 ring-emerald-50 dark:ring-emerald-500/20">
              {initialName}
            </div>

            {/* Info User */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {userName}
              </h4>
              <p className="mt-0.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                {session?.user?.email || "Menunggu email..."}
              </p>

              {/* Badges Role & Location (Hanya tampil untuk Admin/Petugas) */}
              {(userRole === "admin" || userRole === "petugas") && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {userRole}
                  </span>
                  
                  {userLocationId && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300">
                      <MapPin className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      {locationName} {/* 🚨 Sudah di-mapping */}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 🚨 KONDISI: Tombol Edit HANYA buat role "user" (Warga) */}
          {userRole === "user" && (
            <button
              onClick={openModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:bg-[#1a2332] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white sm:w-auto cursor-pointer z-10"
            >
              <PenSquare className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* MODAL EDIT (Hanya bisa dibuka kalau tombol di atas muncul) */}
     {/* MODAL EDIT (Tetap pakai struktur lu sebelumnya) */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-2">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nama Panjang</Label>
                    <Input type="text" defaultValue={userName} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" defaultValue={session?.user?.email || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" defaultValue="+62 812 3456 7890" />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" defaultValue="Warga aktif pelapor infrastruktur" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}