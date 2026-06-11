'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import Loading from './loading';
import { loginAction } from '../actions';
import { redirect } from 'next/navigation';

interface LoginFormData {
    username: string;
    password: string;
}

export default function Login() {
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
    } = useForm<LoginFormData>();

    const onSubmit = (data: LoginFormData) => {
        const form = new FormData();
        form.append('username', data.username);
        form.append('password', data.password);
        startTransition(async () => {
            const result = await loginAction(form);

            if (!result?.success) {
                toast.error(result?.message ?? 'Ocorreu um erro');
                return;
            }

            toast.success(result?.message);
            redirect('/');
        });
    };

    return (
        <>
            <div className="flex items-center justify-center h-full flex-wrap flex-col">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-15">Expense Spreadsheet</h1>

                <form className="w-[400px] max-w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required {...register('username', { required: true })} disabled={isPending} />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required {...register('password', { required: true })} disabled={isPending} />
                    </div>
                    <div className="flex justify-between items-center">
                        <Link href="/create-account" className="text-white cursor-pointer" >Criar conta</Link>

                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center" disabled={isPending}>{isPending ? 'Entrando...' : 'Entrar'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}
