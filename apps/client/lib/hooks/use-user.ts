'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserDataAction, updateUserDataAction } from '@/actions';
import { UserCreateUpdateInterface } from '../../../interfaces/user.create.update.interface';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUserDataAction,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UserCreateUpdateInterface) => updateUserDataAction(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
    });
}
