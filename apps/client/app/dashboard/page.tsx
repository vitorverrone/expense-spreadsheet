import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BillsList from "@/components/bills-list";
import { Header } from "@/components/header";
import { getBillsAction, getUserDataAction } from '@/actions';
import { AuthProvider } from '@/contexts/auth-context';

interface DashboardProps {
    searchParams: Promise<{
        month?: string;
        year?: string;
        title?: string
    }>;
}

export default async function Dashboard(props: DashboardProps) {
    const searchParams = await props.searchParams;
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('token');

    if (!isAuthenticated) {
        redirect('/');
    }

    const [bills, user] = await Promise.all([
        getBillsAction(searchParams),
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