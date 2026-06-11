'use client';

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { MdArrowForwardIos, MdArrowBackIos, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { GoSearch, GoPlus } from "react-icons/go";
import { IoMdTrash } from "react-icons/io";

import AddBillModal from "./add-bill-modal";
import DeleteBillModal from "./delete-bill-modal";
import { Bill } from "../../interfaces/bill.iterface";
import { useAuth } from "@/contexts/auth-context";

export default function BillsList({ bills, month, year }: { bills: Bill[], month: string, year: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const today = new Date(Number(year), Number(month), 1);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [filterSearch, setFilterSearch] = useState(searchParams.get('title') ?? '');
    const [showAddBillModal, setShowAddBillModal] = useState(false);
    const [showDeleteBillModal, setShowDeleteBillModal] = useState(false);
    const [deleteBillId, setDeleteBillId] = useState(0);

    const longMonth = useMemo(() =>
        new Date(Number(year), Number(month), 1).toLocaleString('default', { month: 'long' })
        , [month, year]);

    const newYear = useMemo(() =>
        today.getFullYear()
        , [month, year]);

    const navigateMonth = useCallback((step: number) => {
        let newMonth = parseInt(month) + step;
        let newYear = parseInt(year);

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        const navigatedDate = new Date(newYear, newMonth, 1);
        const params = new URLSearchParams(searchParams.toString());

        params.set('month', (newMonth + 1).toString());
        params.set('year', newYear.toString());
        router.push(`${pathname}?${params.toString()}`);
    }, [month, year, searchParams, router, pathname]);

    const handleDeleteBill = useCallback((id: number) => {
        setDeleteBillId(id);
        setShowDeleteBillModal(true);
    }, []);

    const handleChangeFilterSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterSearch(e.target.value);

        const params = new URLSearchParams(searchParams.toString());

        if (e.target.value === '') {
            params.delete('title');
        } else {
            params.set('title', e.target.value);
        }

        router.push(`${pathname}?${params.toString()}`);
    }, [searchParams, router, pathname]);

    if (!user) return null;

    const userId = user.id;
    let monthTotal = 0;

    const showSubtractionTotal = () => {
        const salary = user.salary ?? 0;
        const balance = salary - monthTotal;
        return balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    const renderedBills = bills?.map((bill) => {
        const recurrentBill = bill.billType === 'recurrent';
        let billValue = bill.value;

        if (bill.billType === 'installment') {
            billValue = (bill.value / bill.installments);
        }

        monthTotal += billValue;

        return (
            <tr key={bill.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {bill.title}
                </th>
                <td className="hidden md:table-cell px-6 py-4 text-center">
                    {recurrentBill ? '-' : bill.installments}
                </td>
                <td className="px-6 py-4 text-center">
                    {billValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-center">
                    {recurrentBill ? '✅' : '❌'}
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-center">
                    {new Date(bill.billDate).toLocaleDateString('default')}
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-center">
                    {recurrentBill ? '-' : ('0' + (new Date(bill.finalDate).getMonth() + 1)).slice(-2) + '/' + new Date(bill.finalDate).getFullYear()}
                </td>
                <td className="px-6 py-4 text-center">
                    <button className="cursor-pointer" onClick={() => handleDeleteBill(bill.id)}><IoMdTrash /></button>
                </td>
            </tr>
        )
    });


    return (
        <div className="container mx-auto">
            <AddBillModal showBillModal={showAddBillModal} setShowBillModal={setShowAddBillModal} userId={userId} />
            <DeleteBillModal showDeleteBillModal={showDeleteBillModal} setShowDeleteBillModal={setShowDeleteBillModal} billId={deleteBillId} />

            <div className="flex items-center justify-between mb-4">
                <p className="flex gap-2 text-3xl font-bold dark:text-white">
                    <span className="hidden md:block">Suas contas do mês de </span>
                    <span className="capitalize">{longMonth}</span> / {newYear}
                </p>


                <div className="flex items-center gap-3">
                    <FaFilter className="cursor-pointer" onClick={() => setShowFilterBar(!showFilterBar)} />

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigateMonth(-1)}>
                        <MdArrowBackIos />
                    </button>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigateMonth(1)}>
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>

            {showFilterBar && <div className="my-5 items-center flex gap-5 overflow-hidden">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <GoSearch />
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full outline-none" placeholder="Conta de Luz..." onChange={handleChangeFilterSearch} />
                </div>

                <MdOutlineRemoveRedEye className="cursor-pointer" />
            </div>}

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Conta
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-center">
                                Quantidade de parcelas
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Valor / mês
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-center">
                                Recorrente
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-center">
                                Feita em
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-center">
                                Finaliza em
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedBills}
                    </tbody>
                </table>
            </div>

            <div className="fixed left-[50%] z-10 bottom-0 w-full container mx-auto flex items-center justify-between dark:bg-gray-900 p-5 shadow-xl" style={{ transform: 'translateX(-50%)' }}>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setShowAddBillModal(true)}>
                    <GoPlus />
                </button>

                <h3 className="flex gap-5 text-3xl font-bold dark:text-white text-right">
                    <span className="hidden md:block">{user.salarySubtraction ? 'Saldo' : 'Total'} do mês:</span>
                    {user.salarySubtraction ? showSubtractionTotal() : monthTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
            </div>
        </div>
    )
}
