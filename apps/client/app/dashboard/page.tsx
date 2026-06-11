import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BillsList from "@/components/bills-list";
import { Header } from "@/components/header";
import { getUserDataAction } from '@/actions';
import type { Bill } from '../../../interfaces/bill.iterface';
import { AuthProvider } from '@/contexts/auth-context';

interface DashboardProps {
    searchParams: Promise<{
        month?: string;
        year?: string;
        title?: string
    }>;
}

async function getBills(params: { month?: string; year?: string, title?: string }): Promise<Bill[] | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    const url = new URL(`${process.env.API_URL}/api/bills`);

    if (params.month) url.searchParams.append('month', params.month);
    if (params.year) url.searchParams.append('year', params.year);
    if (params.title) url.searchParams.append('title', params.title);

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const resJson = await res.json();
    return resJson;
}

export default async function Dashboard(props: DashboardProps) {
    const searchParams = await props.searchParams;
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('token');

    if (!isAuthenticated) {
        redirect('/');
    }

    const [bills, user] = await Promise.all([
        getBills(searchParams),
        getUserDataAction()
    ]);

    const currentMonth = searchParams.month ? (parseInt(searchParams.month) - 1).toString() : new Date().getMonth().toString();
    const currentYear = searchParams.year || new Date().getFullYear().toString();

    return (
        <AuthProvider user={user!}>
            <Header />
            <BillsList bills={bills!} month={currentMonth} year={currentYear} />
        </AuthProvider>
    );
}