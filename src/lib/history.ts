import { api } from "@/lib/api";
import { Report } from "@/lib/report";

export interface HistoryReportData {
  id: string;
  id_user: string;
  id_report: string;
  created_at: string;
  updated_at: string;
  report?: Report;
}

export async function getUserReportHistory(idUser: string) {
  return await api(`/api/history/${idUser}`, {
    method: "GET",
  });
}

export async function getUserCommentHistory(idUser: string) {
  return await api(`/api/user-comments/${idUser}`, {
    method: "GET",
  });
}

export async function deleteReportHistory(idHistory: string) {
  return await api(`/api/history/${idHistory}`, {
    method: "DELETE",
  });
}