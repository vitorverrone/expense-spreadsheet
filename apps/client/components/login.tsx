'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import Loading from './loading';
import { loginAction } from '../actions';
import { redirect } from 'next/navigation';

interface LoginFormData {
    username: string;
    password: string;
}

export default function Login() {
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await loginAction(form);

            if (!result?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success(result?.message);
            redirect('/');
        });
    }

    return (
        <>
            <div className="flex items-center justify-center h-full">
                <form className="w-[400px] max-w-full" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input name="username" type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={formData.username} onChange={handleChange} disabled={isPending} />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input name="password" type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={formData.password} onChange={handleChange} disabled={isPending} />
                    </div>
                    <div className="flex justify-between items-center">
                        <Link href="/create-account" className="text-white cursor-pointer" >Create account</Link>

                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center" disabled={isPending}>{isPending ? <Loading /> : 'Login'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}
