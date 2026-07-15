import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../api/subscriptionsApi';
import type {
  CreateSubscriptionByPatientPayload,
  CreateSubscriptionByDoctorPayload,
  RejectSubscriptionPayload,
} from '../api/subscriptionsApi';

export const subscriptionsKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionsKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...subscriptionsKeys.lists(), page, limit] as const,
  pending: () => [...subscriptionsKeys.all, 'pending'] as const,
  myCurrent: () => [...subscriptionsKeys.all, 'myCurrent'] as const,
};

/** Get all subscriptions - for doctor/admin dashboard */
export function useAllSubscriptions(page = 1, limit = 100) {
  return useQuery({
    queryKey: subscriptionsKeys.list(page, limit),
    queryFn: () => subscriptionsApi.getAll(page, limit),
  });
}

/** Get pending subscription requests - for doctor/admin dashboard */
export function usePendingSubscriptions(page = 1, limit = 100) {
  return useQuery({
    queryKey: subscriptionsKeys.pending(),
    queryFn: () => subscriptionsApi.getPending(page, limit),
  });
}

/** Get current user's subscription - for patient */


export function useCreateSubscriptionByPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionByPatientPayload) =>
      subscriptionsApi.createByPatient(payload),
    onSuccess: (newSubscription) => {
      // ✅ بعد ما المريض يشترك، نحط الـ subscription الجديدة في الـ cache فوراً
      // بدل ما ننتظر refetch يرجع بيانات قديمة بسبب الـ 304
      queryClient.setQueryData(subscriptionsKeys.myCurrent(), newSubscription);
    },
  });
}
 
export function useMyCurrentSubscription(enabled: boolean = true) {
  return useQuery({
    queryKey: subscriptionsKeys.myCurrent(),
    queryFn: subscriptionsApi.getMyCurrent,
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });
}
 
/** Patient creates a subscription request */

/** Doctor creates an active subscription directly */
export function useCreateSubscriptionByDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionByDoctorPayload) => subscriptionsApi.createByDoctor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.pending() });
    },
  });
}

/** Approve a pending subscription */
export function useApproveSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.pending() });
    },
  });
}

/** Reject a pending subscription */
export function useRejectSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RejectSubscriptionPayload) => subscriptionsApi.reject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.pending() });
    },
  });
}

/** Cancel a subscription */
export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.myCurrent() });
    },
  });
}

/** Patient cancels their own active subscription */
export function useCancelMySubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsApi.cancelMine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.myCurrent() });
    },
  });
}
