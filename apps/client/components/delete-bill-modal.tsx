'use client'

import { useDeleteBill } from "@/lib/hooks/use-bills";
import className from "classnames";
import toast from "react-hot-toast";
import { GoX } from "react-icons/go";
import { RiErrorWarningLine } from "react-icons/ri";

interface DeleteBillModalProps {
    showDeleteBillModal: boolean;
    setShowDeleteBillModal: (show: boolean) => void;
    billId: number;
}

export default function DeleteBillModal({ showDeleteBillModal, setShowDeleteBillModal, billId }: DeleteBillModalProps) {
    const deleteBill = useDeleteBill();
    const handleDeleteBill = async () => {
        const result = await deleteBill.mutateAsync(billId);

        if (!result?.success) {
            toast.error(result?.message ?? 'Ocorreu um erro');
            return;
        }

        toast.success(result.message);
        setShowDeleteBillModal(false);
    };

    const classes = className(
        'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full',
        {
            'flex': showDeleteBillModal,
            'hidden': !showDeleteBillModal,
        }
    );

    return (
        <div id="popup-modal" className={classes}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal" onClick={() => setShowDeleteBillModal(false)}>
                        <GoX />
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                        <RiErrorWarningLine className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Tem certeza que deseja deletar esta conta?</h3>
                        <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center" onClick={handleDeleteBill} disabled={deleteBill.isPending}>
                            {deleteBill.isPending ? 'Deletando...' : 'Sim, tenho certeza'}
                        </button>
                        <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => setShowDeleteBillModal(false)}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}