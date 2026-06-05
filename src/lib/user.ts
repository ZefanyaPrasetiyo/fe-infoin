import { api } from "@/lib/api"

export interface User {
    nama_panjang: string;
    email: string;
    password: string;
    nomor_telepon: string | null;
    role: 'admin' | 'user' | 'petugas'
    id_location: string
     created_at?: string
    updated_at?: string;
    deleted_at?: string | null;
}

export interface UserPayload {
    nama_panjang: string;
    email: string;
    password: string;
    nomor_telepon?: string | null;
    role: 'admin' | 'user' | 'petugas';
    id_location: string;
}

export async function getUsers() {
    return await api("/api/users", {
        method: "GET"
    })
}

export async function getUserById(id: string) {
    return await api(`/api/user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },   
    })
}

export async function createUser(payload: UserPayload) {
    return await api("/api/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export async function updateUser(id: string, payload: UserPayload) {
    return await api(`/api/user/${id}`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...payload,
            _method: "PUT"
        })
    })
}

export async function deleteUser(id: string) {
    return await api(`/api/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
}

