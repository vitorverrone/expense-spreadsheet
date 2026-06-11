export type BillType = 'normal' | 'recurrent' | 'installment';

export interface Bill {
    id: number;
    userId: number;
    title: string;
    value: number;
    installments: number;
    billType: BillType;
    finalDate: string;
    billDate: string;
    createdAt: string;
}
