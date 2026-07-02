import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) =>
    [...usersKeys.lists(), { page, limit, search }] as const,
  infiniteList: (search?: string) => [...usersKeys.all, 'infinite', { search }] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

// ==========================================
// Queries
// ==========================================

/** GET /users — جلب كل المستخدمين */
export const useAllUsers = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: usersKeys.list(page, limit, search),
    queryFn: () => doctorUsersApi.getAll(page, limit, search),
    placeholderData: (prev) => prev,
  });
};

import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfinitePatients = (search = '') => {
  return useInfiniteQuery({
    queryKey: usersKeys.infiniteList(search),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await doctorUsersApi.getAll(pageParam, 20, search);
      // تصفية المرضى فقط محلياً إذا لم يدعم الباك إند البحث/الفلترة
      const patients = res.data.filter((u: any) => u.role === 'patient');
      return {
        ...res,
        data: patients
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, numberOfPages } = lastPage.pagination;
      return currentPage < numberOfPages ? currentPage + 1 : undefined;
    },
  });
};

/** GET /users/{id} — جلب مستخدم بالـ ID */
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => doctorUsersApi.getById(id),
    enabled: !!id,
  });
};

// ==========================================
// Mutations
// ==========================================

/** POST /users/create — إنشاء مستخدم جديد */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => doctorUsersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

/** PATCH /users/{id} — تحديث بيانات مستخدم */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      doctorUsersApi.updateById(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
    },
  });
};

/** PATCH /users/change-password — تغيير كلمة المرور */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      doctorUsersApi.changePassword(payload),
  });
};

/** PATCH /users/{id}/activations — تفعيل / إلغاء تفعيل مستخدم */
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

/** DELETE /users/{id}/delete — حذف مستخدم نهائياً */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorUsersApi.deleteById(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};