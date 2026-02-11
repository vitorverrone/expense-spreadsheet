export default interface Bill {
    id: number;
    userId: number;
    title: string;
    value: number;
    installments: number;
    billType: string;
    finalDate: string;
    billDate: string;
    createdAt: string;
}
