import { api } from "@/lib/api"

export interface Category {
    id: string | number;
    nama: string;
    kode_kategori: string;
    slug: string;
}

export interface payloadcreateCategory {
    nama: string;
    kode_kategori: string;
    slug?: string;
}

export async function getCategories() {
    return await api("/api/category")
}

export async function getCategoryById(id: string | number) {
    return await api(`/api/category/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },   
    })
}

export async function createCategory(payload: payloadcreateCategory) {
    return await api("/api/category", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export async function updateCategory(id: string | number, payload: payloadcreateCategory) {
    return await api(`/api/category/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
}

export async function deleteCategory(id: string | number) {
    return await api(`/api/category/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
}