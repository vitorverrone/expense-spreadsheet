'use client'

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { startTransition } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

import UserInterface from '../../../interfaces/user.interface';
import { createUserAction } from '@/actions';

import Input from '@/components/input-form';

export default function CreateAccount() {
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
                <div className="relative flex items-center justify-center mb-8">
                    <Link href="/" className="absolute left-0 text-gray-500 hover:text-white transition-colors">
                        <MdOutlineKeyboardArrowLeft size={40} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create account</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <Input {...register('name', { required: 'Name is required' })} placeholder="João Silva" disabled={isSubmitting} />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <Input {...register('username', { required: 'Username is required' })} placeholder="seu_usuario" disabled={isSubmitting} />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                        <Input type="email" {...register('email', { required: 'E-mail is required' })} placeholder="email@exemplo.com" disabled={isSubmitting} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <Input 
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum of 6 characters' }
                            })}
                            placeholder="••••••••"
                            disabled={isSubmitting}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}