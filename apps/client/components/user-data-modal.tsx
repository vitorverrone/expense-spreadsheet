import { useForm } from "react-hook-form";
import { GoX } from "react-icons/go";
import { currency } from 'remask';
import className from 'classnames';

import { updateUserDataAction } from "@/actions";
import Input from "./input-form";
import Modal from "./modal";
import UserInterface from "../../interfaces/user.interface";
import toast from "react-hot-toast";

interface UserDataModalProps {
    showUserDataModal: boolean;
    setShowUserDataModal: (show: boolean) => void;
    user: UserInterface
}

export default function UserDataModal ({ showUserDataModal, setShowUserDataModal, user }: UserDataModalProps) {
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm<UserInterface>();

    const handleOnSubmit = async (data: UserInterface) => {
        data.salary = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: data.salary })
        
        const result = await updateUserDataAction(data);

        if (!result?.success) {
            toast.error(result?.message);
            return;
        }

        toast.success(result?.message);
        reset();
        setShowUserDataModal(false);
    };

    const handleCurrencyChange = (e) => {
        const value = e.target.value || 0;
        const raw = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: value })
        const masked = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: raw })
        setValue('salary', masked);
    };

    const modalFooterContent = (
        <button type="submit" onClick={handleSubmit(handleOnSubmit)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Salvar</button>
    )

    return (
        <Modal show={showUserDataModal} modalTitle="Meus dados" setShow={setShowUserDataModal} modalFooter={modalFooterContent} formSubmit={handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...register('id')} value={user.id} />
            <div className="mb-5 text-left">
                <label htmlFor="userNickname" className="block mb-2 text-sm font-medium dark:text-white">Usuário</label>
                <Input type="text" id="userNickname" {...register('username', { required: "O campo usuário é obrigatório" })} defaultValue={user.username} />
                {/* {errors.username && <span>{errors.username.message}</span>} */}
            </div>

            <div className="mb-5 text-left">
                <label htmlFor="userEmail" className="block mb-2 text-sm font-medium dark:text-white">E-mail</label>
                <Input type="email" id="userEmail" {...register('email', { required: "O campo email é obrigatório" })} defaultValue={user.email} />
                {/* {errors.email && <span>{errors.email.message}</span>} */}
            </div>

            <div className="mb-5 text-left">
                <label htmlFor="userSalary" className="block mb-2 text-sm font-medium dark:text-white">Salario</label>
                <Input type="text" id="userSalary" {...register('salary')} defaultValue={currency.mask({ locale: 'pt-BR', currency: 'BRL', value: user.salary })} onChange={handleCurrencyChange} />
            </div>

            <div className="mb-5 text-left flex items-center">
                <input type="checkbox" id="userSalarySubtraction" {...register('salarySubtraction')} defaultChecked={user.salarySubtraction} />
                <label htmlFor="userSalarySubtraction" className="ml-3 block text-sm font-medium dark:text-white">Subtrair salário do total por mês?</label>
            </div>
        </Modal>
    )
}
