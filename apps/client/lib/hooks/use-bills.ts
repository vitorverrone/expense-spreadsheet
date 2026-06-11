'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBillsAction, addBillAction, deleteBillAction } from '@/actions';
import { Bill } from '../../../interfaces/bill.iterface';

export function useBills(params: { month?: string; year?: string; title?: string }) {
    return useQuery({
        queryKey: ['bills', params],
        queryFn: () => getBillsAction(params),
    });
}

export function useAddBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Bill) => addBillAction(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bills'] }),
    });
}

export function useDeleteBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (billId: number) => deleteBillAction(billId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bills'] }),
    });
}
