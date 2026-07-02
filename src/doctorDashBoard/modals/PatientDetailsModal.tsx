import { motion, AnimatePresence } from 'motion/react';
import {
  X, Mail, Phone, MapPin, Ruler, Weight as WeightIcon,
  Calendar, Trash2, UserX, UserCheck, Loader2, ShieldAlert, Dumbbell, Plus, Activity, TrendingUp, MessageCircle, Apple
} from 'lucide-react';
import { useState } from 'react';
import {
  useUserById,
  useDeleteUser,
  useToggleUserActivation,
} from '../hooks/useDoctorUsers';
import type { ApiUser } from '../api/doctorUsersApi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PatientDetailsModalProps {
  userId: string;
  onClose: () => void;
  onDeleted?: () => void;
  onShowUserPrograms?: (userId: string, userName: string) => void; // لعرض البرامج التدريبية
  onAssignProgram?: (userId: string, userName: string) => void; // لتعيين برنامج تدريبي جديد
  onShowUserPlans?: (userId: string, userName: string) => void; // لعرض الخطط الغذائية
  onShowStats?: (userId: string, userName: string) => void; // لعرض الإحصائيات (Dashboard)
  onMessage?: (userId: string) => void; // لبدء المحادثة
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm truncate">{value}</p>
    </div>
  </div>
);

const SkeletonRow = () => (
  <div className="h-14 bg-secondary rounded-2xl animate-pulse" />
);

// ─── Delete Confirm Overlay ───────────────────────────────────────────────────

const DeleteConfirm = ({
  userName,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  userName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center z-10"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4"
    >
      <ShieldAlert className="w-8 h-8 text-red-500" />
    </motion.div>
    <h3 className="text-xl font-bold mb-2">تأكيد الحذف</h3>
    <p className="text-muted-foreground mb-6 leading-relaxed">
      هل أنت متأكد من حذف{' '}
      <span className="font-bold text-foreground">{userName}</span>{' '}
      نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
    </p>
    <div className="flex gap-3 w-full">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCancel}
        className="flex-1 py-3 rounded-2xl bg-secondary font-semibold"
      >
        إلغاء
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isDeleting}
        onClick={onConfirm}
        className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        نعم، احذف
      </motion.button>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function PatientDetailsModal({
  userId,
  onClose,
  onDeleted,
  onShowUserPrograms,
  onAssignProgram,
  onShowUserPlans,
  onShowStats,
  onMessage,
}: PatientDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: user, isLoading } = useUserById(userId);
  const { mutate: toggleActivation, isPending: isToggling } = useToggleUserActivation();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = () => {
    deleteUser(userId, {
      onSuccess: () => {
        onDeleted?.();
        onClose();
      },
    });
  };

  const getAvatar = (u: ApiUser) =>
    u.images?.[0] ? (
      <img
        src={u.images[0]}
        alt={u.fullName}
        className="w-16 h-16 rounded-full object-cover border-2 border-white/40"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
        {u.fullName?.charAt(0).toUpperCase()}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* ─── Header ─── */}
        <div className="relative bg-gradient-to-br from-primary to-accent p-6 text-white">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse" />
              <div className="space-y-2">
                <div className="w-40 h-5 bg-white/20 rounded-full animate-pulse" />
                <div className="w-24 h-4 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {getAvatar(user)}
              <div>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.isActive
                        ? 'bg-green-400/30 text-white'
                        : 'bg-red-400/30 text-white'
                    }`}
                  >
                    {user.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20">
                    {user.role === 'doctor'
                      ? 'طبيب'
                      : user.role === 'admin'
                        ? 'مسؤول'
                        : 'مريض'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20">
                    {user.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* ─── Body ─── */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : user ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow icon={Mail}        label="البريد الإلكتروني" value={user.email} />
                <InfoRow icon={Phone}       label="الهاتف"            value={user.phone} />
                <InfoRow icon={MapPin}      label="البلد"             value={user.country} />
                <InfoRow icon={Calendar}    label="العمر"             value={`${user.age} سنة`} />
                <InfoRow icon={WeightIcon}  label="الوزن"             value={`${user.weight} كجم`} />
                <InfoRow icon={Ruler}       label="الطول"             value={`${user.height} سم`} />
              </div>

              {/* Programs and Stats Columns */}
              <div className="space-y-4">
                  {/* تمت إزالة القسم المكرر للبرامج التدريبية من هنا */}

                <div className="bg-secondary/50 rounded-2xl p-4 border border-primary/5">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    الإحصائيات والتقدم
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onShowStats?.(userId, user?.fullName || '')}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl shadow-sm hover:shadow-md transition-all border border-primary/10 group text-primary"
                  >
                    <span className="text-sm font-semibold">عرض لوحة الإحصائيات</span>
                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </motion.button>
                </div>
              </div>

              {/* ─── Action Buttons ─── */}
              <div className="space-y-2 pt-1">
                {/* مراسلة المريض */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMessage?.(userId)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  مراسلة المريض
                </motion.button>

                {/* إدارة البرامج التدريبية */}
                <div className="flex gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onShowUserPrograms?.(userId, user?.fullName || '')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all border border-blue-200/50"
                  >
                    <Dumbbell className="w-4 h-4" />
                    عرض التمارين
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onAssignProgram?.(userId, user?.fullName || '')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all border border-purple-200/50"
                  >
                    <Plus className="w-4 h-4" />
                    تعيين تمارين
                  </motion.button>
                </div>

                {/* إدارة الخطط الغذائية */}
                <div className="flex gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onShowUserPlans?.(userId, user?.fullName || '')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all border border-orange-200/50"
                  >
                    <Apple className="w-4 h-4" />
                    عرض الأنظمة
                  </motion.button>
                </div>

                <div className="flex gap-2">
                  {/* تفعيل / تعطيل */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isToggling}
                    onClick={() => toggleActivation(userId)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all disabled:opacity-60 ${
                      user.isActive
                        ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : user.isActive ? (
                      <><UserX className="w-4 h-4" /> تعطيل</>
                    ) : (
                      <><UserCheck className="w-4 h-4" /> تفعيل</>
                    )}
                  </motion.button>

                  {/* حذف */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              تعذّر تحميل بيانات المستخدم
            </p>
          )}
        </div>

        {/* ─── Delete Confirm Overlay ─── */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <DeleteConfirm
              userName={user?.fullName ?? ''}
              isDeleting={isDeleting}
              onCancel={() => setShowDeleteConfirm(false)}
              onConfirm={handleDelete}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}