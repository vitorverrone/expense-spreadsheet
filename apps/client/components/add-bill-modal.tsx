import { useForm, Controller } from 'react-hook-form';
import { currency } from 'remask';
import toast from 'react-hot-toast';

import Input from "./input-form";
import Modal from "./modal";
import { addBillAction } from '@/actions';
import Bill from '../../interfaces/bill.iterface';
import { BillType } from '../../interfaces/bill.iterface';
import Loading from './loading';

interface AddBillModalProps {
    showBillModal: boolean;
    setShowBillModal: (show: boolean) => void;
    userId: string;
}

export default function AddBillModal({ showBillModal, setShowBillModal, userId }: AddBillModalProps) {
    const { control, register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<Bill>({
        defaultValues: { installments: 0, billType: 'normal' as BillType }
    });

    const selectedType = watch('billType');

    const handleOnSubmit = async (data: Bill) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const date = new Date(data.billDate);
        const finalDate = new Date(selectedType === 'installment' ? new Date(date).setMonth(date.getMonth() + Number(data.installments - 1)) : tomorrow).toISOString().split('T')[0];

        data.value = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: data.value.toString() });

        const bill = {
            ...data,
            userId: Number(userId),
            finalDate
        }

        const result = await addBillAction(bill);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        reset();
        setShowBillModal(false);
    };

    const handleCurrencyChange = (e) => {
        const value = e.target.value || 0;
        const raw = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: value })
        const masked = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: raw })
        setValue('value', masked);
    };

    const modalFooterContent = (
        <button type="button" disabled={isSubmitting} onClick={handleSubmit(handleOnSubmit)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isSubmitting ? <Loading /> : 'Send'}</button>
    )

    return (
        <Modal show={showBillModal} modalTitle="Adicionar Conta" setShow={setShowBillModal} formSubmit={handleSubmit(handleOnSubmit)} modalFooter={modalFooterContent}>
            <div className="mb-5">
                <label htmlFor="title" className="block mb-2 text-sm font-medium dark:text-white">Nome da conta</label>
                <Input type="text" id="title" placeholder="Ex: Conta de Luz" {...register('title', { required: "O campo nome é obrigatório" })} />
                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
            </div>

            <div className="mb-5">
                <label htmlFor="value" className="block mb-2 text-sm font-medium dark:text-white">Valor da conta</label>
                <Input type="text" id="value" placeholder="R$ 200,00" {...register('value', { required: "O campo valor é obrigatório" })} onChange={handleCurrencyChange} />
                {errors.value && <span className="text-red-500">{errors.value.message}</span>}
            </div>

            <div className="mb-5">
                <label htmlFor="billDate" className="block mb-2 text-sm font-medium dark:text-white">Data da compra</label>
                <Input type="date" id="billDate" placeholder="Ex: Conta de Luz" {...register('billDate', { required: "O campo data é obrigatório" })} />
                {errors.billDate && <span className="text-red-500">{errors.billDate.message}</span>}
            </div>

            <div className="my-5">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tipo de compra
                </h4>

                <div className="flex items-start my-5 gap-6 flex-wrap">
                    <Controller
                        name="billType"
                        control={control}
                        render={({ field }) => (
                            <>
                                {[
                                    { id: 'normal', label: 'Normal', icon: '💰' },
                                    { id: 'installment', label: 'Parcelada', icon: '🗓️' },
                                    { id: 'recurrent', label: 'Recorrente', icon: '🔄' }
                                ].map((type) => (
                                    <div className="flex items-center h-5" key={type.id}>
                                        <input id={`billType${type.id}`} type="radio" value={type.id} name="billType" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600" onChange={() => field.onChange(type.id)} />
                                        <label htmlFor={`billType${type.id}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{type.label} {type.icon}</label>
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                {errors.billType && <span className="text-red-500">{errors.billType.message}</span>}
            </div>

            {selectedType === 'installment' && (<div className="mb-5">
                <label htmlFor="installments" className="block mb-2 text-sm font-medium dark:text-white">Parcelas</label>
                <Input type="number" id="installments" placeholder="Ex: Conta de Luz" {...register('installments', { required: "O campo parcelas é obrigatório" })} />
                {errors.installments && <span className="text-red-500">{errors.installments.message}</span>}
            </div>)}
        </Modal>
    )
}
