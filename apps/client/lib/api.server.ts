import { cookies } from 'next/headers';

const BASE_URL = process.env.API_URL;

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Erro na requisição');
    }
    return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Erro na requisição');
    }
    return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH',
        headers: await getAuthHeaders(),
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Erro na requisição');
    }
    return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Erro na requisição');
    }
    return res.json();
}
