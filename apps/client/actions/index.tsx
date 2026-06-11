'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { Bill } from '../../interfaces/bill.iterface';
import UserInterface from '../../interfaces/user.interface';
import { UserCreateUpdateInterface } from '../../interfaces/user.create.update.interface';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api.server';
import { revalidatePath } from 'next/cache';

interface AuthTokenPayload {
    sub: number;
    username: string;
    user: UserInterface;
}

interface ResponseInterface {
    message: string;
    success: boolean;
}

function isAuthTokenPayload(payload: unknown): payload is AuthTokenPayload {
    return (
        typeof payload === 'object' && payload !== null && 'sub' in payload && 'username' in payload
    );
}

export async function createUserAction(data: UserCreateUpdateInterface): Promise<ResponseInterface> {
    try {
        await apiPost<{ message: string }>('/api/users', data);

        const cookieStore = await cookies();
        const loginRes = await fetch(`${process.env.API_URL}/api/users/login`, {
            method: 'POST',
            body: JSON.stringify({ username: data.username, password: data.password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (loginRes.ok) {
            const loginJson = await loginRes.json();
            const decoded = jwt.verify(loginJson.token, process.env.JWT_SECRET!);

            if (isAuthTokenPayload(decoded)) {
                cookieStore.set('token', loginJson.token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                });
            }
        }

        return { message: 'Conta criada com sucesso', success: true };
    } catch (e) {
        return { message: (e as Error).message, success: false };
    }
}

export async function loginAction(data: FormData): Promise<ResponseInterface | null> {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.API_URL}/api/users/login`, {
        method: 'POST',
        body: JSON.stringify({
            username: data.get('username'),
            password: data.get('password'),
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    const resJson = await res.json();

    if (!res.ok) {
        return { message: resJson.message, success: false };
    }

    const decoded = jwt.verify(resJson.token, process.env.JWT_SECRET!);

    if (!isAuthTokenPayload(decoded)) return null;

    cookieStore.set('token', resJson.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    return { message: resJson.message, success: true };
}


export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete('token');
}

export async function getUserDataAction(): Promise<UserInterface | null> {
    try {
        return await apiGet<UserInterface>('/api/users/me');
    } catch {
        return null;
    }
}

export async function updateUserDataAction(data: UserCreateUpdateInterface): Promise<ResponseInterface | null> {
    try {
        const resJson = await apiPatch<{ message: string }>('/api/users/me', data);
        return { message: resJson.message, success: true };
    } catch (e) {
        return { message: (e as Error).message, success: false };
    }
}

export async function addBillAction(data: Bill): Promise<ResponseInterface> {
    try {
        const resJson = await apiPost<{ message: string }>('/api/bills', data);
        revalidatePath('/dashboard');
        return { message: resJson.message, success: true };
    } catch (e) {
        return { message: (e as Error).message, success: false };
    }
}

export async function deleteBillAction(billId: number): Promise<ResponseInterface> {
    try {
        const resJson = await apiDelete<{ message: string }>(`/api/bills/${billId}`);
        revalidatePath('/dashboard');
        return { message: resJson.message, success: true };
    } catch (e) {
        return { message: (e as Error).message, success: false };
    }
}

export async function getBillsAction(params: { month?: string; year?: string; title?: string }): Promise<Bill[] | null> {
    try {
        const query = new URLSearchParams();

        if (params.month) query.append('month', params.month);
        if (params.year) query.append('year', params.year);
        if (params.title) query.append('title', params.title);

        const qs = query.toString();

        return await apiGet<Bill[]>(`/api/bills${qs ? '?' + qs : ''}`);
    } catch {
        return null;
    }
}

