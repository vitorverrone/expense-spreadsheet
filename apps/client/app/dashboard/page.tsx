import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import BillsList from "@/components/bills-list";
import { Header } from "@/components/header";
import { getUserDataAction } from '@/actions';

interface DashboardProps {
    searchParams: Promise<{
        month?: string; 
        year?: string;
        title?: string
    }>;
}

async function getBills(params: { month?: string; year?: string, title?: string }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const url = new URL(`${process.env.API_URL}/api/bills/${decoded.sub}`);

    if (params.month) url.searchParams.append('month', params.month);
    if (params.year) url.searchParams.append('year', params.year);
    if (params.title) url.searchParams.append('title', params.title);

    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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

    const currentMonth = searchParams.month || new Date().getMonth().toString();
    const currentYear = searchParams.year || new Date().getFullYear().toString();

    return (
        <>
            <Header user={user} />

            <BillsList bills={bills} userId={user.id} month={currentMonth} year={currentYear} />
        </>
    );
}