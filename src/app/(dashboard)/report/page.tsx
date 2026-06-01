"use client";

import { useState, useRef } from "react";
import {
  ImagePlus, MapPin, X, Send, CheckCircle2,
  AlertCircle, Locate, Map, Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";

const MyMap = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0d1724]">
      <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
    </div>
  ),
});

const CATEGORIES = [
  { id: "1", nama: "Infrastruktur" },
  { id: "2", nama: "Keamanan" },
  { id: "3", nama: "Lingkungan" },
  { id: "4", nama: "Kesehatan" },
  { id: "5", nama: "Sosial" },
  { id: "6", nama: "Lainnya" },
];

interface FormState {
  name: string;
  phone: string;
  description: string;
  categoryId: string;
  locationMode: "gps" | "map";
  locationDetail: string;
}

interface Errors {
  name?: string;
  phone?: string;
  description?: string;
  categoryId?: string;
  locationDetail?: string;
}

export default function ReportPage() {
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", description: "",
    categoryId: "", locationMode: "gps", locationDetail: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (key in errors) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.phone.trim()) e.phone = "Nomor HP wajib diisi";
    if (!form.description.trim()) e.description = "Kronologi wajib diisi";
    if (!form.categoryId) e.categoryId = "Pilih kategori laporan";
    if (!form.locationDetail.trim()) e.locationDetail = "Detail lokasi wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const slots = 5 - previews.length;
    files.slice(0, slots).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev =>
        setPreviews(p => [...p, ev.target?.result as string].slice(0, 5));
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  
  const removeImage = (i: number) => setPreviews(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); 
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Laporan Berhasil Dikirim!</h2>
          <p className="mt-1 text-sm text-slate-400">Tim kami akan menindaklanjuti laporan Anda secepatnya.</p>
        </div>
        <div className="rounded-lg bg-[#1a2332] px-5 py-3 text-sm text-slate-400">
          No. Laporan:{" "}
          <span className="font-mono font-semibold text-emerald-400">
            LPR-{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name:"",phone:"",description:"",categoryId:"",locationMode:"gps",locationDetail:"" });
            setPreviews([]);
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
          <h1 className="text-lg font-semibold text-black dark:text-white">Form Laporan Masyarakat</h1>
          <p className="text-xs text-slate-500">Sampaikan temuan atau keluhan Anda kepada pihak berwenang</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_300px]">

        <div className="rounded-xl bg-gray-100 dark:bg-[#111c2d] p-5 ring-1 ring-white/5">
          <h2 className="text-lg font-semibold text-black dark:text-white">Identitas Pelapor</h2>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">Nama Lengkap</FieldLabel>
                {errors.name && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />{errors.name}
                  </span>
                )}
              </div>
              <Input
                className={`w-full rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border outline-none transition focus:ring-2 focus:ring-emerald-500/30 ${errors.name ? "border-red-500/60 focus:border-red-500" : "border-slate-200 dark:border-white/5 focus:border-emerald-500/60"}`}
                placeholder="cth. Budi Santoso"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
            </Field>
            
            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">Nomor HP yang dapat dihubungi</FieldLabel>
                {errors.phone && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />{errors.phone}
                  </span>
                )}
              </div>
              <Input
                className={`w-full rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border outline-none transition focus:ring-2 focus:ring-emerald-500/30 ${errors.phone ? "border-red-500/60 focus:border-red-500" : "border-slate-200 dark:border-white/5 focus:border-emerald-500/60"}`}
                placeholder="cth. 08123456789"
                type="tel"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
              />
            </Field>
          </div>
          
          <div className="mt-4">
            <Field className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">Deskripsi Kronologi Kejadian</FieldLabel>
                {errors.description && (
                  <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />{errors.description}
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  className={`min-h-[120px] resize-none pr-14 w-full rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border outline-none transition focus:ring-2 focus:ring-emerald-500/30 ${errors.description ? "border-red-500/60 focus:border-red-500" : "border-slate-200 dark:border-white/5 focus:border-emerald-500/60"}`}
                  placeholder="Ceritakan apa yang terjadi, kapan, dan bagaimana kondisinya..."
                  maxLength={500}
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
                <span className="absolute bottom-3 right-3 text-xs text-slate-600">
                  {form.description.length}/500
                </span>
              </div>
            </Field>
          </div>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-[#111c2d] p-5 ring-1 ring-white/5">
          <h2 className="text-lg font-semibold text-black dark:text-white">Bukti Foto</h2>
          <p className="mt-1 text-xs text-slate-500">Opsional · maks. 5 foto · PNG, JPG (5MB)</p>

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
          <Input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-[#1a2332]">
                  <img src={src} alt="" className="h-full w-full object-cover" />
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

      <div className="rounded-xl bg-gray-100 dark:bg-[#111c2d] p-5 ring-1 ring-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black dark:text-white">Kategori Laporan</h2>
          {errors.categoryId && (
            <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
              <AlertCircle className="h-3 w-3" />{errors.categoryId}
            </span>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => set("categoryId", c.id)}
              className={[
                "flex flex-col items-center gap-2 rounded-lg border py-3 text-xs font-medium transition",
                form.categoryId === c.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-white/5 bg-white dark:bg-[#1a2332] text-slate-500 dark:text-slate-400 hover:border-emerald-600/40 hover:text-slate-900 dark:hover:text-slate-200",
              ].join(" ")}
            >
              <span className="text-center leading-tight">#{c.nama}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gray-100 dark:bg-[#111c2d] ring-1 ring-white/5 overflow-hidden">
        <div className="p-5 pb-0">
          <h2 className="text-lg font-semibold text-black dark:text-white">Lokasi Kejadian</h2>

          <div className="mt-3 flex gap-2">
            {(["gps", "map"] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => set("locationMode", mode)}
                className={[
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition",
                  form.locationMode === mode
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-white/5 bg-white dark:bg-[#1a2332] text-slate-500 dark:text-slate-400 hover:border-white/10 hover:text-slate-900 dark:hover:text-slate-200",
                ].join(" ")}
              >
                {mode === "gps"
                  ? <><Locate className="h-3.5 w-3.5" />Lokasi Saat Ini</>
                  : <><Map className="h-3.5 w-3.5" />Pilih di Peta</>}
              </button>
            ))}
          </div>

          {form.locationMode === "gps" && (
            <div className="mt-4 pb-5">
              <div className="mt-4">
                <Field className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">Detail / Patokan Lokasi</FieldLabel>
                    {errors.locationDetail && (
                      <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                        <AlertCircle className="h-3 w-3" />{errors.locationDetail}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <textarea
                      className={`min-h-40 resize-none pl-9 w-full rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border outline-none transition focus:ring-2 focus:ring-emerald-500/30 ${errors.locationDetail ? "border-red-500/60 focus:border-red-500" : "border-slate-200 dark:border-white/5 focus:border-emerald-500/60"}`}
                      placeholder="cth. Dekat warung Bu Siti, RT 03/04, seberang masjid…"
                      value={form.locationDetail}
                      onChange={e => set("locationDetail", e.target.value)}
                    />
                  </div>
                </Field>
              </div>
            </div>
          )}
        </div>

        {form.locationMode === "map" && (
          <>
            <div className="px-5 pb-4 pt-4">
              <Field className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <FieldLabel className="text-xs font-medium text-slate-500 dark:text-slate-400">Detail / Patokan Lokasi</FieldLabel>
                  {errors.locationDetail && (
                    <span className="flex items-center gap-1 text-xs font-normal text-red-500 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />{errors.locationDetail}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <textarea
                    className={`min-h-[72px] resize-none pl-9 w-full rounded-lg bg-white dark:bg-[#1a2332] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 border outline-none transition focus:ring-2 focus:ring-emerald-500/30 ${errors.locationDetail ? "border-red-500/60 focus:border-red-500" : "border-slate-200 dark:border-white/5 focus:border-emerald-500/60"}`}
                    placeholder="cth. Dekat warung Bu Siti, RT 03/04, seberang masjid…"
                    value={form.locationDetail}
                    onChange={e => set("locationDetail", e.target.value)}
                  />
                </div>
                
              </Field>
              <p className="mt-2 text-xs text-slate-500">
                Klik pada peta untuk menandai titik lokasi · Search bar tersedia di atas peta
              </p>
            </div>
            <div className="h-[300px] border-t border-white/5 relative z-0">
              <MyMap position={mapPosition} setPosition={setMapPosition} zoom={13} />
            </div>
            
            <div className="flex items-center gap-2 border-t border-white/5 px-5 py-2.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {mapPosition 
                  ? `Titik terpilih: ${mapPosition[0].toFixed(5)}, ${mapPosition[1].toFixed(5)}`
                  : "Belum ada titik dipilih"}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gray-100 dark:bg-[#111c2d] px-5 py-4 ring-1 ring-white/5">
        <p className="text-xs text-slate-500">Pastikan semua data sudah benar sebelum mengirim</p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" />Mengirim…</>
            : <><Send className="h-4 w-4" />Kirim Laporan</>}
        </button>
      </div>
    </div>
  );
}