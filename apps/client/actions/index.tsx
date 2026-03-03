'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache'

import Bill from '../../interfaces/bill.iterface';
import UserInterface from '../../interfaces/user.interface';

interface AuthTokenPayload {
    id: number;
    username: string;
    user: Array<any>;
}

function isAuthTokenPayload(payload: unknown): payload is AuthTokenPayload {
    return (
        typeof payload === 'object' && payload !== null && 'sub' in payload && 'username' in payload
    );
}

export async function createUserAction(data: UserInterface) {
    const res = await fetch(`${process.env.API_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });

    const resJson = await res.json();

    if (!res.ok) {
        return { message: resJson.message, success: false };
    }

    return { message: resJson.message, success: true };
}

export async function loginAction(data: FormData) {
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

export async function getUserDataAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    const res = await fetch(`${process.env.API_URL}/api/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const resJson = await res.json();
    return resJson;
}

export async function updateUserDataAction(data: UserInterface) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    const res = await fetch(`${process.env.API_URL}/api/users/me`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const resJson = await res.json();

    revalidatePath('/dashboard')
    return { message: resJson.message, success: true };
}

export async function addBillAction(data: Bill) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${process.env.API_URL}/api/bills`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const resJson = await res.json();

    if (!res.ok) {
        return { message: resJson.message, success: false };
    }

    revalidatePath('/dashboard')
    return { message: resJson.message, success: true };
}

export async function deleteBillAction(billId: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${process.env.API_URL}/api/bills/${billId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const resJson = await res.json();

    if (!res.ok) {
        return { message: resJson.message, success: false };
    }

    revalidatePath('/dashboard');

    return { message: resJson.message, success: true };
}
