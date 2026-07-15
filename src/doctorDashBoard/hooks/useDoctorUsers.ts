import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  doctorUsersApi,
  type CreateUserPayload,
  type UpdateUserPayload,
  type ChangePasswordPayload,
} from '../api/doctorUsersApi';

// ==========================================
// Query Keys
// ==========================================
export const usersKeys = {
  all:           ['users'] as const,
  lists:         () => [...usersKeys.all, 'list'] as const,
  list:          (page: number, limit: number) => [...usersKeys.lists(), { page, limit }] as const,
  infiniteLists: () => [...usersKeys.all, 'infinite'] as const,
  infiniteList:  (search: string) => [...usersKeys.infiniteLists(), search] as const,
  details:       () => [...usersKeys.all, 'detail'] as const,
  detail:        (id: string) => [...usersKeys.details(), id] as const,
};

// ==========================================
// Queries
// ==========================================

/** GET /users — كل المستخدمين */
export const useAllUsers = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: [...usersKeys.list(page, limit), search],
    queryFn: () => doctorUsersApi.getAll(page, limit, search),
    placeholderData: (prev) => prev,
  });
};

/** GET /users/{id} — مستخدم بالـ ID */
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => doctorUsersApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Infinite scroll للمرضى — مستخدم في CreateSubscriptionModal وغيره
 * بيدعم البحث client-side عن طريق select
 */
export const useInfinitePatients = (search?: string) => {
  return useInfiniteQuery({
    queryKey: usersKeys.infiniteList(search ?? ''),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      doctorUsersApi.getAll(pageParam, 20),
    getNextPageParam: (lastPage) => {
      const { currentPage, numberOfPages } = lastPage.pagination;
      return currentPage < numberOfPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    // فلترة client-side لو في search
    select: search
      ? (data) => ({
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.filter(
              (user) =>
                user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()),
            ),
          })),
        })
      : undefined,
  });
};

// ==========================================
// Mutations
// ==========================================

/** POST /users/create */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => doctorUsersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.infiniteLists() });
    },
  });
};

/** PATCH /users/{id} */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload | FormData }) =>
      doctorUsersApi.updateById(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
    },
  });
};

/** PATCH /users/change-password */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      doctorUsersApi.changePassword(payload),
  });
};

/** PATCH /users/{id}/activations */
export const useToggleUserActivation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorUsersApi.toggleActivation(id),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

/** DELETE /users/{id}/delete */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorUsersApi.deleteById(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.infiniteLists() });
    },
  });
};