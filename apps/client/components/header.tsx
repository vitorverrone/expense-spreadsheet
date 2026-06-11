'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import className from 'classnames';
import { redirect } from 'next/navigation';

import { logoutAction } from '@/actions';
import UserDataModal from './user-data-modal';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
    const { user } = useAuth();
    const [showUserDataModal, setShowUserDataModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (!user) return null;

    const classes = className(
        'pt-5 z-10 font-normal w-44 absolute right-0 top-[100%]',
        {
            'block': dropdownOpen,
            'hidden': !dropdownOpen,
        }
    );

    const handleLogout = () => {
        logoutAction();
        toast.success('Logged out successfully');
        redirect('/');
    };

    return (
        <>
            <UserDataModal showUserDataModal={showUserDataModal} setShowUserDataModal={setShowUserDataModal} user={user} />

            <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="container mx-auto flex flex-wrap items-center justify-between mx-auto mb-[50px] relative">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            Gerenciador de contas
                        </span>
                    </a>

                    {/* <button data-collapse-toggle="navbar-multi-level" type="button" className="h-10 inline-flex items-center justify-center md:hidden p-2 rounded-lg text-sm w-10 text-xl" onClick={() => setShowMenu(!showMenu)} aria-controls="navbar-multi-level" aria-expanded="false">
                        <HiMenu />
                    </button> */}

                    <div className={`absolute md:static md:block md:w-auto max-w-[90vw] right-0 z-2`} id="navbar-multi-level">
                        <ul className="flex flex-col font-medium border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row dark:border-gray-700">
                            <li id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent relative cursor-pointer" onMouseOver={() => setDropdownOpen(true)} onMouseOut={() => setDropdownOpen(false)}>
                                <p className='md:hidden'><FaUser /></p>
                                <p className='hidden md:block'>{user.name}</p>
                                <div id="dropdownNavbar" className={classes}>
                                    <div className="py-2 text-sm text-gray-700 dark:text-gray-200 md:bg-white md:divide-y divide-gray-100 rounded-lg md:shadow-sm md:dark:bg-gray-700 md:dark:divide-gray-600" aria-labelledby="dropdownLargeButton">
                                        <p>
                                            <button className="w-full text-left block md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={() => { setShowUserDataModal(true); setDropdownOpen(false) }}>Meus dados</button>
                                        </p>

                                        <div className="py-1">
                                            <button onClick={handleLogout} className="w-full text-left block md:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">Sair</button>
                                        </div>
                                    </div>

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
