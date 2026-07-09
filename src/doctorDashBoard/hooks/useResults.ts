import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsApi } from '../api/resultsApi';
import type { CreateResultPayload, UpdateResultPayload } from '../api/resultsApi';

export const resultsKeys = {
  all: ['results'] as const,
  lists: () => [...resultsKeys.all, 'list'] as const,
  list: (filters: string) => [...resultsKeys.lists(), { filters }] as const,
  details: () => [...resultsKeys.all, 'detail'] as const,
  detail: (id: string) => [...resultsKeys.details(), id] as const,
};

export function useAllResults(page = 1, limit = 10) {
  return useQuery({
    queryKey: resultsKeys.list(JSON.stringify({ page, limit })),
    queryFn: () => resultsApi.getAll(page, limit),
  });
}

export function useResultById(id: string) {
  return useQuery({
    queryKey: resultsKeys.detail(id),
    queryFn: () => resultsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResultPayload) => resultsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultsKeys.lists() });
    },
  });
}

export function useUpdateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateResultPayload }) =>
      resultsApi.update(id, payload),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: resultsKeys.lists() });
      queryClient.setQueryData(resultsKeys.detail(updatedItem.id), updatedItem);
    },
  });
}

export function useDeleteResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resultsApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: resultsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: resultsKeys.lists() });
    },
  });
}
