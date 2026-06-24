import { api } from "./api";

export interface RegisterPayload {
  nama_panjang: string;
  email: string;
  password: string;
  nomor_telepon: string;
  id_location: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload) {
  return await api("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return await api("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}