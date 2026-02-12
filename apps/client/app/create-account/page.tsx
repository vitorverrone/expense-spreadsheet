'use client'

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { startTransition, useState } from 'react';

import UserInterface from '../../../interfaces/user.interface';
import { createUserAction } from '@/actions';
import toast from 'react-hot-toast';

export default function CreateAccount() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserInterface>();

    const onSubmit = async (data: UserInterface) => {
        startTransition(async () => {
            const result = await createUserAction(data);

            if (!result?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success(result?.message);
            redirect('/');
        });
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="w-[400px] max-w-full">

                {/* Header com Botão Voltar alinhado */}
                <div className="relative flex items-center justify-center mb-8">
                    <Link
                        href="/"
                        className="absolute left-0 text-gray-500 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Criar conta</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Campo Name */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome Completo</label>
                        <input
                            {...register('name', { required: 'Nome é obrigatório' })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="João Silva"
                            disabled={isSubmitting}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* Campo Username */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input
                            {...register('username', { required: 'Usuário é obrigatório' })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="seu_usuario"
                            disabled={isSubmitting}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    {/* Campo Email */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                        <input
                            type="email"
                            {...register('email', { required: 'E-mail é obrigatório' })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="email@exemplo.com"
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Campo Senha */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Senha é obrigatória',
                                minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
                            })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}