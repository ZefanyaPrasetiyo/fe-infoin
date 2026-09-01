"use client";

import { useState, useRef, useEffect } from "react";
import {
  ImagePlus,
  MapPin,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Map,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { createReport } from "@/lib/report";
import { getCategories, Category } from "@/lib/category";
import { getLocations, Location } from "@/lib/location";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const MyMap = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0d1724]">
      <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
    </div>
  ),
});

interface FormState {
  name: string;
  phone: string;
  description: string;
  categoryId: string;
  locationId: string;
  locationDetail: string;
}

interface Errors {
  name?: string;
  phone?: string;
  description?: string;
  categoryId?: string;
  locationId?: string;
  locationDetail?: string;
  gambar?: string;
  map?: string;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


export default function ReportPage() {
const session = useSession();
console.log("session", session)
const ID_USER = session?.data?.user?.id

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    description: "",
    categoryId: "",
    locationId: "",
    locationDetail: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          getCategories(),
          getLocations(),
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (locRes.success) setLocations(locRes.data);
      } catch (error) {
        toast.error("Gagal memuat data master");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const set = (key: keyof FormState, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!form.phone.trim()) newErrors.phone = "Nomor HP wajib diisi";
    if (!form.description.trim())
      newErrors.description = "Kronologi wajib diisi";
    if (!form.categoryId) newErrors.categoryId = "Pilih kategori laporan";
    if (!form.locationId) newErrors.locationId = "Pilih area lokasi utama";
    if (!form.locationDetail.trim())
      newErrors.locationDetail = "Detail lokasi wajib diisi";
    if (files.length === 0)
      newErrors.gambar = "Minimal 1 bukti foto wajib diupload";
    if (!mapPosition)
      newErrors.map = "Titik koordinat di peta wajib ditentukan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const filesToAdd = selectedFiles.slice(0, 5 - previews.length);

    setFiles((prev) => [...prev, ...filesToAdd].slice(0, 5));

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviews((p) => [...p, ev.target?.result as string].slice(0, 5));
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (i: number) => {
    setPreviews((p) => p.filter((_, idx) => idx !== i));
    setFiles((f) => f.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const selectedLoc = locations.find((l) => String(l.id) === form.locationId);
    if (selectedLoc && mapPosition) {
      const distance = calculateDistance(
        Number(selectedLoc.latitude),
        Number(selectedLoc.longitude),
        mapPosition[0],
        mapPosition[1],
      );

      if (distance > 2) {
        toast.error(
          "Titik peta terlalu jauh dari area lokasi yang Anda pilih!",
        );
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("id_user", ID_USER ?? "");
      formData.append("id_kategori", form.categoryId);
      formData.append("id_location", form.locationId);
      const namaKategori = categories.find(
        (c) => String(c.id) === form.categoryId,
      )?.nama;
      formData.append(
        "judul_laporan",
        `Pelaporan Kejadian: ${namaKategori || "Umum"}`,
      );
      formData.append("deskripsi", form.description);
      formData.append("alamat", form.locationDetail);

      if (mapPosition) {
        formData.append("latitude", mapPosition[0].toString());
        formData.append("longitude", mapPosition[1].toString());
      }

      // formData.append("catatan", `Pelapor: ${form.name} | HP: ${form.phone}`);

      files.forEach((file) => {
        formData.append("gambar[]", file);
      });

      const res = await createReport(formData);

      if (res && res.success) {
        toast.success("Laporan berhasil dikirim!");
        setSubmitted(true);
      } else {
        toast.error(res?.message || "Gagal mengirim laporan");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            Laporan Berhasil Dikirim!
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Tim kami akan menindaklanjuti laporan Anda secepatnya.
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              phone: "",
              description: "",
              categoryId: "",
              locationId: "",
              locationDetail: "",
            });
            setPreviews([]);
            setFiles([]);
            setMapPosition(null);
          }}
          className="mt-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
        >
          Buat Laporan Baru
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 p-4 pb-10">
      <div className="flex items-center gap-3 border-b border-white/5 pb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
          <Send className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Form Laporan Masyarakat
          </h1>
          <p className="text-xs text-slate-500">
            Sampaikan temuan atau keluhan Anda kepada pihak berwenang
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_300px]">
        <div className="rounded-xl bg-gray-100 p-5 ring-1 ring-white/5 dark:bg-[#111c2d]">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Identitas Pelapor
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Nama Lengkap
                </FieldLabel>
                {errors.name && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </span>
                )}
              </div>
              <Input
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30 dark:bg-[#1a2332] dark:text-white dark:placeholder:text-slate-600 ${errors.name ? "border-red-500/60 focus:border-red-500" : "border-slate-200 focus:border-emerald-500/60 dark:border-white/5"}`}
                placeholder="cth. Budi Santoso"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>

            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Nomor HP yang dapat dihubungi
                </FieldLabel>
                {errors.phone && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </span>
                )}
              </div>
              <Input
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30 dark:bg-[#1a2332] dark:text-white dark:placeholder:text-slate-600 ${errors.phone ? "border-red-500/60 focus:border-red-500" : "border-slate-200 focus:border-emerald-500/60 dark:border-white/5"}`}
                placeholder="cth. 08123456789"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Deskripsi Kronologi Kejadian
                </FieldLabel>
                {errors.description && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  className={`min-h-[120px] w-full resize-none rounded-lg border bg-white px-3 py-2.5 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30 dark:bg-[#1a2332] dark:text-white dark:placeholder:text-slate-600 ${errors.description ? "border-red-500/60 focus:border-red-500" : "border-slate-200 focus:border-emerald-500/60 dark:border-white/5"}`}
                  placeholder="Ceritakan apa yang terjadi, kapan, dan bagaimana kondisinya..."
                  maxLength={500}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <span className="absolute bottom-3 right-3 text-xs text-slate-600">
                  {form.description.length}/500
                </span>
              </div>
            </Field>
          </div>
        </div>

        <div className="rounded-xl bg-gray-100 p-5 ring-1 ring-white/5 dark:bg-[#111c2d]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Bukti Foto
            </h2>
            {errors.gambar && (
              <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.gambar}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Wajib 1 foto · maks. 5 foto · PNG, JPG (5MB)
          </p>

          <button
            type="button"
            onClick={() => previews.length < 5 && fileRef.current?.click()}
            disabled={previews.length >= 5}
            className="mt-4 flex w-full flex-col items-center gap-3 rounded-lg border border-dashed border-emerald-600/40 bg-emerald-500/5 px-4 py-6 text-center transition hover:border-emerald-500/70 hover:bg-emerald-500/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
              <ImagePlus className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {previews.length === 0
                ? "Klik untuk upload foto"
                : previews.length < 5
                  ? `Tambah foto lagi (${previews.length}/5)`
                  : "Maksimal 5 foto"}
            </span>
          </button>
          <Input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImages}
          />

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-[#1a2332]"
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl bg-gray-100 p-5 ring-1 ring-white/5 dark:bg-[#111c2d]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Area Lokasi
            </h2>
            {errors.locationId && (
              <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.locationId}
              </span>
            )}
          </div>

          {loadingData ? (
            <div className="mt-4 flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              <span className="ml-2 text-sm text-slate-500">
                Memuat area...
              </span>
            </div>
          ) : (
            <div className="mt-4">
              <select
                className={`w-full appearance-none rounded-lg border bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-500/30 dark:bg-[#1a2332] dark:text-white ${errors.locationId ? "border-red-500/60 focus:border-red-500" : "border-slate-200 focus:border-emerald-500/60 dark:border-white/5"}`}
                value={form.locationId}
                onChange={(e) => set("locationId", e.target.value)}
              >
                <option value="" disabled>
                  -- Pilih Area Lokasi --
                </option>
                {locations.map((loc) => (
                  <option key={loc.id} value={String(loc.id)}>
                    {loc.nama_lokasi}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-gray-100 p-5 ring-1 ring-white/5 dark:bg-[#111c2d]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Kategori Laporan
            </h2>
            {errors.categoryId && (
              <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.categoryId}
              </span>
            )}
          </div>

          {loadingData ? (
            <div className="mt-4 flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set("categoryId", String(c.id))}
                  className={[
                    "flex flex-col items-center gap-2 rounded-lg border py-2 text-xs font-medium transition",
                    form.categoryId === String(c.id)
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-white/5 bg-white text-slate-500 hover:border-emerald-600/40 hover:text-slate-900 dark:bg-[#1a2332] dark:text-slate-400 dark:hover:text-slate-200",
                  ].join(" ")}
                >
                  <span className="text-center leading-tight">#{c.nama}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-gray-100 ring-1 ring-white/5 dark:bg-[#111c2d]">
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Titik Koordinat Kejadian
            </h2>
            {errors.map && (
              <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.map}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Pilih area lokasi di atas, lalu tandai titik spesifik pada peta di
            bawah.
          </p>

          <div className="mt-4">
            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Detail / Patokan Lokasi
                </FieldLabel>
                {errors.locationDetail && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.locationDetail}
                  </span>
                )}
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <textarea
                  className={`min-h-[72px] w-full resize-none rounded-lg border bg-white px-3 py-2.5 pl-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30 dark:bg-[#1a2332] dark:text-white dark:placeholder:text-slate-600 ${errors.locationDetail ? "border-red-500/60 focus:border-red-500" : "border-slate-200 focus:border-emerald-500/60 dark:border-white/5"}`}
                  placeholder="cth. Dekat warung Bu Siti, RT 03/04, seberang masjid…"
                  value={form.locationDetail}
                  onChange={(e) => set("locationDetail", e.target.value)}
                />
              </div>
            </Field>
          </div>
        </div>

        <div className="relative z-0 h-[300px] border-t border-white/5">
          <MyMap
            position={mapPosition}
            setPosition={setMapPosition}
            zoom={13}
          />
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 px-5 py-2.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {mapPosition
              ? `Titik terpilih: ${mapPosition[0].toFixed(5)}, ${mapPosition[1].toFixed(5)}`
              : "Belum ada titik dipilih"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gray-100 px-5 py-4 ring-1 ring-white/5 dark:bg-[#111c2d]">
        <p className="text-xs text-slate-500">
          Pastikan semua data sudah benar sebelum mengirim
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengirim…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Kirim Laporan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
