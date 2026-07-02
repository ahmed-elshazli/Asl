import { motion } from 'motion/react';
import { User, Mail, Phone, Calendar, LogOut, Crown, Target, Activity, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUpdateProfile, useMyProfile } from '../users/hooks/useUsers';
import { useLogout } from '../login/hooks/useLogout';
import { useAuthStore } from '../store/authStore';
import { PatientReviewCard } from './components/PatientReviewCard';

interface ProfileProps {
  onProtectedAction: (action: () => void) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Profile({ onProtectedAction, isAuthenticated }: ProfileProps) {
  const authUser = useAuthStore((state) => state.user);
  const { data: fetchedProfile, isLoading } = useMyProfile();
  
  // فك التغليف إذا كان الباك إند يرسل البيانات داخل كائن user إضافي
  const actualFetched = fetchedProfile?.user?.user || fetchedProfile?.user || fetchedProfile;
  
  const profile = actualFetched || authUser;
  
  const { mutate: logout, isPending: isLogoutLoading } = useLogout();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    age: profile?.age || '',
    weight: profile?.weight || '',
    height: profile?.height || '',
    gender: profile?.gender || 'male',
    country: profile?.country || '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        age: profile.age || '',
        weight: profile.weight || '',
        height: profile.height || '',
        gender: profile.gender || 'male',
        country: profile.country || '',
      });
    }
  }, [profile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        // ضغط الصورة باستخدام Canvas
        const compressedFile = await new Promise<File>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let { width, height } = img;
              const MAX_SIZE = 800; // أقصى عرض أو طول
              
              if (width > height && width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              } else if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
                } else {
                  resolve(file); // في حالة الفشل، أرسل الأصلية
                }
              }, 'image/jpeg', 0.7); // 70% Quality
            };
            img.onerror = reject;
          };
          reader.onerror = reject;
        });
        
        setImageFile(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (err) {
        console.error("Image compression failed", err);
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleUpdate = () => {
    if (imageFile) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, String(val));
      });
      formData.append('images', imageFile);
      updateProfile(formData);
    } else {
      updateProfile(form);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-white rounded-[3rem] p-16 border border-primary/10 shadow-lg">
            <div className="inline-flex p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-8">
              <User className="w-20 h-20 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4">سجل دخولك</h2>
            <p className="text-muted-foreground text-lg mb-8">
              سجل الدخول للوصول إلى ملفك الشخصي وجميع بياناتك
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProtectedAction(() => {})}
              className="px-8 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold text-lg shadow-lg"
            >
              تسجيل الدخول
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // إنشاء الأحرف الأولى من الاسم
  const getInitials = (name: string) => {
    if (!name) return 'م';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}.${parts[1][0]}`;
    }
    return name.substring(0, 2);
  };

  const stats = [
    { label: 'العمر', value: profile?.age ? `${profile.age} سنة` : '-', icon: Calendar, color: 'from-primary to-accent' },
    { label: 'الوزن', value: profile?.weight ? `${profile.weight} كجم` : '-', icon: Target, color: 'from-accent to-primary' },
    { label: 'الطول', value: profile?.height ? `${profile.height} سم` : '-', icon: Activity, color: 'from-primary to-accent' },
    { label: 'النوع', value: profile?.gender === 'female' ? 'أنثى' : 'ذكر', icon: User, color: 'from-accent to-primary' },
  ];

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          الملف الشخصي
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-5xl font-bold border-4 border-white/30 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : profile?.images?.[0] ? (
                  <img src={profile.images[0]} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile?.fullName || '')
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity backdrop-blur-sm">
                <span className="text-sm font-bold">تغيير الصورة</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h2 className="text-4xl font-bold">{profile?.fullName || 'مستخدم'}</h2>
                <Crown className="w-8 h-8" />
              </div>
              <p className="text-white/80 text-lg mb-4">
                {profile?.country ? `من ${profile.country}` : 'عضو في أصِل'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email || '-'}</span>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{profile?.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg text-center"
              >
                <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-2xl mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-6">المعلومات الشخصية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الاسم الكامل</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">البريد الإلكتروني</label>
              <input
                type="email"
                defaultValue={profile?.email || ''}
                readOnly
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary opacity-70 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">رقم الهاتف</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">العمر</label>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <motion.button
              onClick={handleUpdate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUpdating || isCompressing}
              className="flex-1 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg disabled:opacity-50"
            >
              {isCompressing ? 'جاري ضغط الصورة...' : isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="px-8 py-4 bg-red-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLogoutLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              <span>تسجيل الخروج</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-6">الأهداف الصحية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الوزن الحالي (كجم)</label>
              <input
                type="number"
                value={form.weight}
                onChange={e => setForm({ ...form, weight: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">الطول (سم)</label>
              <input
                type="number"
                value={form.height}
                onChange={e => setForm({ ...form, height: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">النوع</label>
              <select 
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">البلد</label>
              <input
                type="text"
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* قسم إضافة التقييم للمريض */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <PatientReviewCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
