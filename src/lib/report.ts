import { api } from "@/lib/api";

export interface ReportStatus {
  status: ["diproses", "menunggu", "disetujui"]
}

export interface DetailReport {
  id: string;
  id_report: string;
  latitude: number;
  longitude: number;
  alamat: string;
  id_location: string;
  kepercayaan_ai: string;
  label_ai: string;
}

export interface Report {
  id: string;
  kode_report: string;
  id_user: string;
  id_kategori: string;
  judul_laporan: string;
  deskripsi: string;
  status: "menunggu" | "diproses" | "disetujui" | "ditolak";
  bukti_laporan: string[];
  catatan: string | null;
  detail?: DetailReport;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateStatusPayload {
  status: "menunggu" | "diproses" | "disetujui";
  catatan?: string;
}

export async function getReports() {
  return await api("/api/reports", {
    method: "GET",
  });
}

export async function getReportById(id: string) {
  return await api(`/api/reports/${id}`, {
    method: "GET",
  });
}

export async function createReport(payload: FormData) {
  return await api("/api/reports", {
    method: "POST",
    body: payload,
  });
}

export async function updateReportStatus(id: string, payload: UpdateStatusPayload) {
  return await api(`/api/reports/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteReport(id: string) {
  return await api(`/api/reports/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}