import { api } from "@/lib/api"

export interface Location {
    id: string; 
    nama_lokasi: string;
    latitude: number;
    longitude: number;
    radius_km: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface LocationPayload {
    nama_lokasi: string;
    latitude: number;
    longitude: number;
    radius_km?: number; 
}

export async function getLocations() {
    return await api("/api/locations", {
        method: "GET"
    })
}

export async function getLocationById(id: string) {
    return await api(`/api/location/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },   
    })
}

export async function createLocation(payload: LocationPayload) {
    return await api("/api/location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export async function updateLocation(id: string, payload: LocationPayload) {
    return await api(`/api/location/${id}`, {
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

export async function deleteLocation(id: string) {
    return await api(`/api/location/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export async function getDeletedLocations() {
    return await api("/api/locations-deleted", {
        method: "GET"
    })
}

export async function restoreDeletedLocation(id: string) {
    return await api(`/api/location-restore/${id}`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _method: "PUT" // Pake spoofing juga buat amanin request restore lu
        })
    })
}