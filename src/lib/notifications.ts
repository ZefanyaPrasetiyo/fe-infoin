import { api } from "@/lib/api";
import { Report } from "@/lib/report";
import { User } from "@/lib/user";

export interface Notification {
  id: string;
  id_user: string;
  id_report: string;
  type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  
  report?: Report;
  user?: User;
}

export async function getNotifications(id_user: string) {
  return await api(`/api/notifications/${id_user}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}


export async function markNotificationAsRead(id: string) {
  return await api(`/api/notifications/${id}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
}