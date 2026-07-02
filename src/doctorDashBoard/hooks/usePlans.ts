import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  plansApi,
  type CreatePlanPayload,
  type UpdatePlanPayload,
} from '../api/plansApi';

// ==========================================
// Query Keys
// ==========================================
export const plansKeys = {
  all:     ['plans'] as const,
  lists:   () => [...plansKeys.all, 'list'] as const,
  list:    (page: number, limit: number) => [...plansKeys.lists(), { page, limit }] as const,
  details: () => [...plansKeys.all, 'detail'] as const,
  detail:  (id: string) => [...plansKeys.details(), id] as const,
  client:  (clientId: string) => [...plansKeys.all, 'client', clientId] as const,
};

// ==========================================
// Queries
// ==========================================

/** GET /plans — كل الخطط */
export const useAllPlans = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: plansKeys.list(page, limit),
    queryFn: () => plansApi.getAll(page, limit),
    placeholderData: (prev) => prev,
  });
};

/** GET /plans/{id} — خطة واحدة */
export const usePlanById = (id: string) => {
  return useQuery({
    queryKey: plansKeys.detail(id),
    queryFn: () => plansApi.getById(id),
    enabled: !!id,
  });
};

/** GET /plans/client/{id} — خطط مريض معين */
export const usePlansByClient = (clientId: string) => {
  return useQuery({
    queryKey: plansKeys.client(clientId),
    queryFn: () => plansApi.getByClientId(clientId),
    enabled: !!clientId,
  });
};

// ==========================================
// Mutations
// ==========================================

/** POST /plans — إنشاء خطة */
export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => plansApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plansKeys.lists() });
    },
  });
};

/** PUT /plans/{id} — تحديث خطة */
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanPayload }) =>
      plansApi.updateById(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: plansKeys.lists() });
      queryClient.invalidateQueries({ queryKey: plansKeys.detail(id) });
    },
  });
};

/** DELETE /plans/{id} — حذف خطة */
export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plansApi.deleteById(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: plansKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: plansKeys.lists() });
    },
  });
};