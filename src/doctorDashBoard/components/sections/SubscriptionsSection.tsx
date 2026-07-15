import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown, Loader2, Search, XCircle, Calendar, User,
  Clock, CheckCircle2, AlertTriangle, Ban, Plus, Eye,
  Phone, Image, ThumbsUp, ThumbsDown, MessageSquare, CreditCard,
} from 'lucide-react';
import {
  useAllSubscriptions, usePendingSubscriptions,
  useCreateSubscriptionByDoctor, useApproveSubscription,
  useRejectSubscription, useCancelSubscription,
} from '../../hooks/useSubscriptions';
import { useInfinitePatients } from '../../hooks/useDoctorUsers';
import { useAllPaymentMethodsAdmin } from '../../hooks/usePaymentMethods';
import { useSubscriptionPlans } from '../../hooks/useSubscriptionPlans';
import type { Subscription } from '../../api/subscriptionsApi';
import { toast } from 'sonner';
import ConfirmModal from '../../../components/ConfirmModal';

// ==========================================
// Status helpers
// ==========================================
function getStatusInfo(status: string) {
  switch (status) {
    case 'PENDING':
      return { label: 'معلق', color: 'bg-indigo-100 text-indigo-700', icon: Clock };
    case 'ACTIVE':
      return { label: 'نشط', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
    case 'REJECTED':
      return { label: 'مرفوض', color: 'bg-rose-100 text-rose-700', icon: ThumbsDown };
    case 'EXPIRED':
      return { label: 'منتهي', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle };
    case 'CANCELLED':
      return { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: Ban };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-700', icon: Clock };
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function getDaysLeft(endDate?: string) {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ==========================================
// Reject Reason Modal
// ==========================================
interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

function RejectReasonModal({ isOpen, onClose, onConfirm, isPending }: RejectModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-rose-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-900">سبب الرفض</h2>
              <p className="text-xs text-rose-600">يرجى كتابة سبب رفض الطلب</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="اكتب سبب الرفض هنا..."
            rows={3}
            className="w-full p-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-400 text-sm resize-none"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={isPending || !reason.trim()}
              className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد الرفض'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Create Subscription Modal
// ==========================================
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSubscriptionModal({ isOpen, onClose }: CreateModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(userSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearch]);

  const {
    data: infiniteUsersData,
    isLoading: loadingUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfinitePatients(debouncedSearch);

  const { data: plansData, isLoading: loadingPlans } = useSubscriptionPlans();
  const { mutate: createSubscription, isPending } = useCreateSubscriptionByDoctor();

  const patients = infiniteUsersData?.pages.flatMap(page => page.data) || [];
  const rawPlans = plansData?.data || plansData || [];
  const plans = Array.isArray(rawPlans) ? rawPlans : (rawPlans as any)?.data || [];
  const activePlans = plans.filter((p: any) => p.isActive);

  // Handle scroll for infinite pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = Math.ceil(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) >= e.currentTarget.clientHeight - 10;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedPlanId) return;

    createSubscription(
      { userId: selectedUserId, planId: selectedPlanId },
      {
        onSuccess: () => {
          toast.success('تم إنشاء الاشتراك بنجاح');
          onClose();
          setSelectedUserId('');
          setSelectedPlanId('');
          setUserSearch('');
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'حدث خطأ أثناء إنشاء الاشتراك';
          toast.error(typeof msg === 'string' ? msg : msg[0]);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">إنشاء اشتراك جديد</h2>
              <p className="text-xs text-muted-foreground">اختر المريض والباقة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">اختر المريض</label>
            <div className="relative mb-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div
              className="w-full max-h-48 overflow-y-auto bg-secondary rounded-xl p-2 space-y-1"
              onScroll={handleScroll}
            >
              {loadingUsers && patients.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...
                </div>
              ) : patients.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground">لا يوجد مرضى بهذا الاسم</div>
              ) : (
                patients.map((user: any) => (
                  <div
                    key={user.id || user._id}
                    onClick={() => setSelectedUserId(user.id || user._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                      selectedUserId === (user.id || user._id)
                        ? 'bg-primary text-white font-bold'
                        : 'hover:bg-white text-foreground'
                    }`}
                  >
                    <div>
                      <div>{user.fullName}</div>
                      <div className={`text-xs mt-0.5 ${selectedUserId === (user.id || user._id) ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {user.email}
                      </div>
                    </div>
                    {selectedUserId === (user.id || user._id) && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                ))
              )}
              {isFetchingNextPage && (
                <div className="p-2 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">اختر الباقة</label>
            {loadingPlans ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {activePlans.map((plan: any) => (
                  <label
                    key={plan._id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlanId === plan._id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan._id}
                      checked={selectedPlanId === plan._id}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm">{plan.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{plan.durationInDays} يوم</div>
                      </div>
                      <div className="text-primary font-black">{plan.price} {plan.currency || 'EGP'}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors">
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending || !selectedUserId || !selectedPlanId}
              className="px-8 py-3 bg-gradient-to-br from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الاشتراك'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export default function SubscriptionsSection() {
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [rejectTarget, setRejectTarget] = useState<Subscription | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);

  // Queries
  const { data: allResponse, isLoading: loadingAll } = useAllSubscriptions();
  const { data: pendingResponse, isLoading: loadingPending } = usePendingSubscriptions();
  const { data: methodsResp } = useAllPaymentMethodsAdmin();

  const methods = Array.isArray(methodsResp) ? methodsResp : ((methodsResp as any)?.data || []);

  // Mutations
  const { mutate: cancelSub } = useCancelSubscription();
  const { mutate: approveSub, isPending: approving } = useApproveSubscription();
  const { mutate: rejectSub, isPending: rejecting } = useRejectSubscription();

  const allSubs: Subscription[] = allResponse?.data || [];
  const pendingSubs: Subscription[] = pendingResponse?.data || [];

  const filteredSubs = statusFilter
    ? allSubs.filter((s) => s.status === statusFilter)
    : allSubs;

  // --- Action handlers ---
  const handleCancel = (sub: Subscription) => {
    setCancelTarget(sub);
  };

  const handleApprove = (sub: Subscription) => {
    approveSub(sub._id, {
      onSuccess: () => toast.success('تم قبول الاشتراك بنجاح'),
      onError: () => toast.error('فشل قبول الاشتراك'),
    });
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    rejectSub(
      { subscriptionId: rejectTarget._id, rejectReason: reason },
      {
        onSuccess: () => {
          toast.success('تم رفض الاشتراك');
          setRejectTarget(null);
        },
        onError: () => toast.error('فشل رفض الاشتراك'),
      }
    );
  };

  // --- Stats ---
  const pendingCount = allSubs.filter(s => s.status === 'PENDING').length;
  const activeCount = allSubs.filter(s => s.status === 'ACTIVE').length;
  const expiredCount = allSubs.filter(s => s.status === 'EXPIRED').length;
  const rejectedCount = allSubs.filter(s => s.status === 'REJECTED').length;
  const cancelledCount = allSubs.filter(s => s.status === 'CANCELLED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">إدارة الاشتراكات</h2>
          <p className="text-sm text-muted-foreground mt-1">عرض وإدارة اشتراكات المستخدمين</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-gradient-to-br from-primary to-accent text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">إنشاء اشتراك</span>
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-border/50 shadow-sm">
          <div className="text-2xl font-black text-foreground">{allSubs.length}</div>
          <div className="text-xs text-muted-foreground font-medium">إجمالي الاشتراكات</div>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <div className="text-2xl font-black text-indigo-600">{pendingCount}</div>
          <div className="text-xs text-indigo-700 font-medium">معلق</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
          <div className="text-xs text-emerald-700 font-medium">نشط</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <div className="text-2xl font-black text-orange-600">{expiredCount}</div>
          <div className="text-xs text-orange-700 font-medium">منتهي</div>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <div className="text-2xl font-black text-rose-600">{rejectedCount}</div>
          <div className="text-xs text-rose-700 font-medium">مرفوض</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="text-2xl font-black text-red-600">{cancelledCount}</div>
          <div className="text-xs text-red-700 font-medium">ملغي</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'pending'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          طلبات معلقة
          {pendingSubs.length > 0 && (
            <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-black">
              {pendingSubs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          كل الاشتراكات
        </button>
      </div>

      {/* ===================== TAB 1: Pending Requests ===================== */}
      {activeTab === 'pending' && (
        <>
          {loadingPending ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pendingSubs.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-border">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
              <p className="text-muted-foreground font-medium">لا توجد طلبات معلقة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {pendingSubs.map((sub, idx) => {
                  const userName = typeof sub.user === 'object' ? sub.user?.fullName : 'مستخدم';
                  const userEmail = typeof sub.user === 'object' ? sub.user?.email : '';
                  const planName = typeof sub.plan === 'object' ? sub.plan?.name : 'باقة';
                  const planPrice = typeof sub.plan === 'object' ? sub.plan?.price : 0;
                  
                  let pmName = 'وسيلة دفع غير معروفة';
                  if (typeof sub.paymentMethod === 'object' && sub.paymentMethod?.name) {
                    pmName = sub.paymentMethod.name;
                  } else if (typeof sub.paymentMethod === 'string') {
                    const found = methods.find((m: any) => m.id === sub.paymentMethod || m._id === sub.paymentMethod);
                    if (found) pmName = found.name;
                  }

                  return (
                    <motion.div
                      key={sub._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="p-5">
                        {/* User info */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                              {userName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-foreground">{userName}</div>
                              <div className="text-xs text-muted-foreground">{userEmail}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                            <Clock className="w-3 h-3" />
                            معلق
                          </div>
                        </div>

                        {/* Plan info */}
                        <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">{planName}</span>
                            </div>
                            <span className="text-primary font-black text-sm">{planPrice} EGP</span>
                          </div>
                        </div>

                        {/* Payment details */}
                        <div className="space-y-2 mb-4">
                          {sub.paymentMethod && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>وسيلة الدفع: <span className="font-bold text-foreground">{pmName}</span></span>
                            </div>
                          )}
                          {sub.senderNumber && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="w-3.5 h-3.5" />
                              <span>رقم المرسل: <span className="font-bold text-foreground">{sub.senderNumber}</span></span>
                            </div>
                          )}
                          {sub.paymentScreenshot && (
                            <a
                              href={sub.paymentScreenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-primary hover:underline"
                            >
                              <Image className="w-3.5 h-3.5" />
                              <span>عرض إيصال الدفع</span>
                              <Eye className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Created date */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>تاريخ الطلب: {formatDate(sub.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="border-t border-border/50 px-5 py-3 flex gap-3">
                        <button
                          onClick={() => handleApprove(sub)}
                          disabled={approving}
                          className="flex-1 text-sm text-emerald-600 hover:text-emerald-700 font-bold hover:bg-emerald-50 rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          قبول
                        </button>
                        <button
                          onClick={() => setRejectTarget(sub)}
                          className="flex-1 text-sm text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          رفض
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ===================== TAB 2: All Subscriptions ===================== */}
      {activeTab === 'all' && (
        <>
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '', label: 'الكل' },
              { value: 'PENDING', label: 'معلق' },
              { value: 'ACTIVE', label: 'نشط' },
              { value: 'EXPIRED', label: 'منتهي' },
              { value: 'REJECTED', label: 'مرفوض' },
              { value: 'CANCELLED', label: 'ملغي' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  statusFilter === filter.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-muted-foreground border border-border hover:border-primary/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Subscriptions List */}
          {loadingAll ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredSubs.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-border">
              <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium">لا توجد اشتراكات {statusFilter ? 'بهذا الفلتر' : 'حتى الآن'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredSubs.map((sub, idx) => {
                  const status = getStatusInfo(sub.status);
                  const StatusIcon = status.icon;
                  const daysLeft = sub.status === 'ACTIVE' ? getDaysLeft(sub.endDate) : null;
                  const userName = typeof sub.user === 'object' ? sub.user?.fullName : 'مستخدم';
                  const userEmail = typeof sub.user === 'object' ? sub.user?.email : '';
                  const planName = typeof sub.plan === 'object' ? sub.plan?.name : 'باقة';
                  const planPrice = typeof sub.plan === 'object' ? sub.plan?.price : 0;

                  let pmName = 'وسيلة دفع غير معروفة';
                  if (typeof sub.paymentMethod === 'object' && sub.paymentMethod?.name) {
                    pmName = sub.paymentMethod.name;
                  } else if (typeof sub.paymentMethod === 'string') {
                    const found = methods.find((m: any) => m.id === sub.paymentMethod || m._id === sub.paymentMethod);
                    if (found) pmName = found.name;
                  }

                  return (
                    <motion.div
                      key={sub._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {userName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-foreground">{userName}</div>
                              <div className="text-xs text-muted-foreground">{userEmail}</div>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </div>
                        </div>

                        {/* Plan info */}
                        <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">{planName}</span>
                            </div>
                            <span className="text-primary font-black text-sm">{planPrice} EGP</span>
                          </div>
                        </div>

                        {/* Payment details */}
                        <div className="space-y-2 mb-4">
                          {sub.paymentMethod && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>وسيلة الدفع: <span className="font-bold text-foreground">{pmName}</span></span>
                            </div>
                          )}
                          {sub.senderNumber && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="w-3.5 h-3.5" />
                              <span>رقم المرسل: <span className="font-bold text-foreground">{sub.senderNumber}</span></span>
                            </div>
                          )}
                          {sub.paymentScreenshot && (
                            <a
                              href={sub.paymentScreenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-primary hover:underline"
                            >
                              <Image className="w-3.5 h-3.5" />
                              <span>عرض إيصال الدفع</span>
                              <Eye className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>بداية: {formatDate(sub.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>نهاية: {formatDate(sub.endDate)}</span>
                          </div>
                        </div>

                        {/* Days left */}
                        {daysLeft !== null && (
                          <div className={`mt-3 text-xs font-bold text-center py-1.5 rounded-lg ${
                            daysLeft <= 7
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {daysLeft > 0 ? `متبقي ${daysLeft} يوم` : 'ينتهي اليوم'}
                          </div>
                        )}

                        {/* Reject reason */}
                        {sub.status === 'REJECTED' && sub.rejectReason && (
                          <div className="mt-3 flex items-start gap-1.5 text-[11px] text-rose-600 bg-rose-50 rounded-lg p-2">
                            <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                            <span>سبب الرفض: {sub.rejectReason}</span>
                          </div>
                        )}

                        {/* Approved by */}
                        {sub.approvedBy && (
                          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>بواسطة: {(sub.approvedBy as any)?.fullName || 'غير محدد'}</span>
                          </div>
                        )}
                      </div>

                      {/* Cancel Action */}
                      {sub.status === 'ACTIVE' && (
                        <div className="border-t border-border/50 px-5 py-3">
                          <button
                            onClick={() => handleCancel(sub)}
                            className="w-full text-sm text-red-500 hover:text-red-600 font-bold hover:bg-red-50 rounded-lg py-2 transition-colors"
                          >
                            إلغاء الاشتراك
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <CreateSubscriptionModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        isPending={rejecting}
      />

      {/* Cancel Confirm Modal */}
      <ConfirmModal
        isOpen={!!cancelTarget}
        title="إلغاء الاشتراك"
        message={`هل أنت متأكد من إلغاء اشتراك "${(cancelTarget?.user as any)?.fullName || 'المستخدم'}"؟`}
        confirmText="إلغاء الاشتراك"
        onConfirm={() => {
          if (cancelTarget) {
            cancelSub(cancelTarget._id, {
              onSuccess: () => toast.success('تم إلغاء الاشتراك'),
              onError: () => toast.error('فشل إلغاء الاشتراك'),
              onSettled: () => setCancelTarget(null),
            });
          }
        }}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
