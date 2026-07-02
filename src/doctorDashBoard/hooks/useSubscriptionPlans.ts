import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi, type CreateSubscriptionPlanPayload, type UpdateSubscriptionPlanPayload } from '../api/subscriptionPlansApi';

export const subscriptionPlansKeys = {
  all: ['subscriptionPlans'] as const,
  lists: () => [...subscriptionPlansKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...subscriptionPlansKeys.lists(), { page, limit }] as const,
  details: () => [...subscriptionPlansKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionPlansKeys.details(), id] as const,
};

export const useSubscriptionPlans = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: subscriptionPlansKeys.list(page, limit),
    queryFn: () => subscriptionPlansApi.getAll(page, limit),
  });
};

export const useSubscriptionPlan = (id: string) => {
  return useQuery({
    queryKey: subscriptionPlansKeys.detail(id),
    queryFn: () => subscriptionPlansApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionPlanPayload) => subscriptionPlansApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionPlansKeys.lists() });
    },
  });
};

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSubscriptionPlanPayload }) =>
      subscriptionPlansApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionPlansKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionPlansKeys.detail(variables.id) });
    },
  });
};

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionPlansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionPlansKeys.lists() });
    },
  });
};

export const useToggleSubscriptionPlanStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionPlansApi.toggleStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionPlansKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionPlansKeys.detail(id) });
    },
  });
};
