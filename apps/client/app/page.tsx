import { cookies } from 'next/headers';
import Login from "@/components/login";
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('token');

  if (!isAuthenticated) {
    return <Login />;
  } else {
    redirect('/dashboard')
  }
}
