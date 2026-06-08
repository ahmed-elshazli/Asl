import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Sparkles, Crown, Mail, Phone, Calendar, Activity } from 'lucide-react';
import { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (type: 'patient' | 'doctor') => void;
}

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [loginType, setLoginType] = useState<'patient' | 'doctor'>('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  
  // 1. إضافة حالة التحميل المؤقتة
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. تشغيل حالة التحميل
    setIsLoading(true);

    // 3. محاكاة طلب للباك إند (تأخير لمدة 1.5 ثانية)
    setTimeout(() => {
      setIsLoading(false);
      // بعد انتهاء الوقت الوهمي، نرسل نوع المستخدم للـ App ليدخله
      onLogin(loginType);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', bounce: 0.3 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 max-w-md w-full shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            // تعطيل زر الإغلاق أثناء التحميل
            disabled={isLoading}
            className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-6"
            >
              {loginType === 'doctor' ? (
                <Crown className="w-12 h-12 text-white" />
              ) : (
                <Sparkles className="w-12 h-12 text-white" />
              )}
            </motion.div>

            <h2 className="text-3xl font-bold mb-2">
              {loginType === 'doctor' ? 'تسجيل دخول الطبيب' : (isLogin ? 'مرحباً بعودتك' : 'انضم إلينا')}
            </h2>
            <p className="text-muted-foreground">
              {loginType === 'doctor' ? 'سجل دخولك باستخدام بيانات الطبيب' : (isLogin ? 'سجل دخولك للمتابعة' : 'أنشئ حسابك الآن')}
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <motion.button
              type="button"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              onClick={() => !isLoading && setLoginType('patient')}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-full font-bold transition-all ${
                loginType === 'patient'
                  ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg'
                  : 'bg-secondary text-muted-foreground'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <User className="w-5 h-5 inline-block ml-2" />
              مريض
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              onClick={() => !isLoading && setLoginType('doctor')}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-full font-bold transition-all ${
                loginType === 'doctor'
                  ? 'bg-gradient-to-br from-accent to-primary text-white shadow-lg'
                  : 'bg-secondary text-muted-foreground'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Crown className="w-5 h-5 inline-block ml-2" />
              طبيب
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && loginType === 'patient' && (
              <>
                <div>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="الاسم الكامل"
                      required
                      disabled={isLoading}
                      className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="العمر"
                        required
                        disabled={isLoading}
                        className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="الوزن (كجم)"
                        required
                        disabled={isLoading}
                        className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="الطول (سم)"
                        required
                        disabled={isLoading}
                        className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="رقم الجوال"
                      required
                      disabled={isLoading}
                      className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  required
                  disabled={isLoading}
                  className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  required
                  disabled={isLoading}
                  className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {isLogin && loginType === 'patient' && (
              <div className="text-left">
                <button type="button" disabled={isLoading} className="text-sm text-primary hover:underline disabled:opacity-50">
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white rounded-full font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${
                loginType === 'doctor'
                  ? 'bg-gradient-to-br from-accent to-primary'
                  : 'bg-gradient-to-br from-primary to-accent'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {/* 4. تغيير محتوى الزرار أثناء التحميل */}
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحميل...</span>
                </>
              ) : (
                loginType === 'doctor' ? 'تسجيل الدخول كطبيب' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')
              )}
            </motion.button>
          </form>

          {loginType === 'patient' && (
            <div className="text-center mb-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
                className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب؟ '}
                <span className="font-bold text-primary">
                  {isLogin ? 'سجل الآن' : 'سجل الدخول'}
                </span>
              </button>
            </div>
          )}

          {loginType === 'doctor' && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                تسجيل الدخول مخصص للأطباء المسجلين فقط
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-6">
            بالمتابعة، أنت توافق على{' '}
            <button className="text-primary hover:underline">شروط الخدمة</button>
            {' '}و{' '}
            <button className="text-primary hover:underline">سياسة الخصوصية</button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}