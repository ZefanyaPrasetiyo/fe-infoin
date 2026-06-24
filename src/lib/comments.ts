import { api } from "@/lib/api";

export interface CommentUser {
  id: string;
  name?: string;
  nama_panjang?: string; 
}

export interface CommentData {
  id: string;
  id_user: string;
  id_report: string;
  message: string;
  id_parent: string | null;
  created_at: string;
  updated_at: string;
  user?: CommentUser;
  replies?: CommentData[];
}

export interface CreateCommentPayload {
  id_user: string;
  id_report: string;
  message: string;
  id_parent?: string | null;
}

export async function getComments(idReport: string) {
  return await api(`/api/comments/${idReport}`, {
    method: "GET",
  });
}

export async function createComment(payload: CreateCommentPayload) {
  return await api("/api/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateComment(id: string, message: string) {
  return await api(`/api/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ message }),
  });
}

export async function deleteComment(id: string) {
  return await api(`/api/comments/${id}`, {
    method: "DELETE",
  });
}