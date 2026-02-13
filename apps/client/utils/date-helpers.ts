import { BillType } from "../../interfaces/bill.iterface";

export const calculateFinalDate = (startDate: string, type: BillType, installments: number): string => {
    const date = new Date(startDate);
    
    if (type === 'installment' && installments > 0) {
        date.setMonth(date.getMonth() + (Number(installments) - 1));
        return date.toISOString().split('T')[0];
    }

    if (type === 'recurrent') {
        return '2099-12-31';
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};
