import { motion } from 'motion/react';
import {
  Plus, Search, Calendar, ChevronRight, ChevronLeft,
  Loader2, User, Mail, Phone, MapPin, Ruler, Weight,
} from 'lucide-react';
import { useState } from 'react';
import { useAllUsers } from '../../hooks/useDoctorUsers';
import type { ApiUser } from '../../api/doctorUsersApi';

interface PatientsSectionProps {
  onShowAddPatient: () => void;
  onSelectPatient: (userId: string) => void;
}

export function PatientsSection({ onShowAddPatient, onSelectPatient }: PatientsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: usersResponse, isLoading } = useAllUsers(currentPage, 10);
  const allUsers = usersResponse?.data || [];
  const pagination = usersResponse?.pagination;

  const filteredUsers = searchQuery === ''
    ? allUsers
    : allUsers.filter((user: ApiUser) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || '؟';

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'doctor': return { label: 'طبيب',   color: 'bg-blue-100 text-blue-700' };
      case 'admin':  return { label: 'مسؤول',  color: 'bg-purple-100 text-purple-700' };
      default:       return { label: 'مريض',   color: 'bg-green-100 text-green-700' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">إدارة المرضى</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            {isLoading
              ? 'جاري التحميل...'
              : `${usersResponse?.results || 0} مستخدم — صفحة ${pagination?.currentPage || 1} من ${pagination?.numberOfPages || 1}`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowAddPatient}
          className="px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">إضافة مريض جديد</span>
          <span className="sm:hidden">إضافة مريض</span>
        </motion.button>
      </div>

      {/* ─── Card ─── */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-primary/10 shadow-lg">
        {/* Search */}
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الإيميل..."
            className="w-full pr-12 pl-6 py-3 md:py-4 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-primary">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-lg font-semibold">جاري تحميل المستخدمين...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <User className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-semibold">
              لا يوجد مستخدمين {searchQuery ? 'يطابقون البحث' : 'حالياً'}
            </p>
          </div>
        ) : (
          /* ─── List ─── */
          <div className="space-y-2 md:space-y-3">
            {filteredUsers.map((user: ApiUser, idx: number) => {
              const roleBadge = getRoleBadge(user.role);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, x: -5 }}
                  onClick={() => onSelectPatient(user.id)}
                  className="flex items-center gap-3 p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all border border-primary/5"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getInitial(user.fullName)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-bold truncate">{user.fullName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                      {!user.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 flex-shrink-0">
                          غير نشط
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[140px] md:max-w-none">{user.email}</span>
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span dir="ltr">{user.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                    {/* Mobile metrics */}
                    <div className="flex items-center gap-3 mt-1.5 md:hidden text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{user.weight} كجم</span>
                      <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{user.height} سم</span>
                      <span>{user.age} سنة</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{user.country}</span>
                    </div>
                  </div>

                  {/* Desktop metrics */}
                  <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                    {[
                      { label: 'الوزن', value: user.weight, unit: 'كجم' },
                      { label: 'الطول', value: user.height, unit: 'سم' },
                      { label: 'العمر',  value: user.age,    unit: '' },
                      { label: 'البلد',  value: user.country, unit: '' },
                    ].map(({ label, value, unit }) => (
                      <div key={label} className="text-center">
                        <p className="text-xs text-muted-foreground/70">{label}</p>
                        <p className="font-bold text-foreground">
                          {value} {unit && <span className="text-xs font-normal">{unit}</span>}
                        </p>
                      </div>
                    ))}
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {pagination && pagination.numberOfPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-primary/10">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-primary/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.numberOfPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-md'
                      : 'bg-secondary text-muted-foreground hover:bg-primary/10'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              disabled={currentPage >= pagination.numberOfPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}