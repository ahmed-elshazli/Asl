import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodsApi } from '../api/paymentMethodsApi';
import type { CreatePaymentMethodPayload, UpdatePaymentMethodPayload } from '../api/paymentMethodsApi';

export const paymentMethodsKeys = {
  all: ['paymentMethods'] as const,
  lists: () => [...paymentMethodsKeys.all, 'list'] as const,
  list: () => [...paymentMethodsKeys.lists(), 'active'] as const,
  adminList: () => [...paymentMethodsKeys.lists(), 'admin'] as const,
  details: () => [...paymentMethodsKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentMethodsKeys.details(), id] as const,
};

export function useAllPaymentMethods() {
  return useQuery({
    queryKey: paymentMethodsKeys.list(),
    queryFn: paymentMethodsApi.getAll,
  });
}

export function useAllPaymentMethodsAdmin() {
  return useQuery({
    queryKey: paymentMethodsKeys.adminList(),
    queryFn: paymentMethodsApi.getAllAdmin,
  });
}

export function usePaymentMethodById(id: string) {
  return useQuery({
    queryKey: paymentMethodsKeys.detail(id),
    queryFn: () => paymentMethodsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentMethodPayload) => paymentMethodsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() });
    },
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentMethodPayload }) =>
      paymentMethodsApi.update(id, payload),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() });
      queryClient.setQueryData(paymentMethodsKeys.detail(updatedItem.id), updatedItem);
    },
  });
}

export function useTogglePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.toggleStatus(id),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() });
      queryClient.setQueryData(paymentMethodsKeys.detail(updatedItem.id), updatedItem);
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: paymentMethodsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() });
    },
  });
}
