import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Sparkles, Mail, Phone, Calendar, Activity, CheckCircle, Key } from 'lucide-react';
import { useState } from 'react';
import { useLogin } from '../login/hooks/useLogin';
import { useRegister } from '../login/hooks/useRegister';
import { useForgotPassword } from '../login/hooks/useForgotPassword';
import { useVerifyResetCode } from '../login/hooks/useVerifyResetCode';
import { useResetPassword } from '../login/hooks/useResetPassword';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const codeToCountry: Record<string, string> = {
    '+966': 'السعودية',
    '+20': 'مصر',
    '+971': 'الإمارات',
    '+965': 'الكويت',
    '+974': 'قطر',
    '+968': 'عُمان',
    '+973': 'البحرين',
    '+962': 'الأردن',
  };
  
  const [mode, setMode] = useState<AuthMode>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [country, setCountry] = useState('السعودية');
  const [countryCode, setCountryCode] = useState('+966');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { login, isLoading: isLoginLoading } = useLogin();
  const { register, isLoading: isRegisterLoading } = useRegister();
  const { mutateAsync: forgotPassword, isPending: isForgotLoading } = useForgotPassword();
  const { mutateAsync: verifyCode, isPending: isVerifyLoading } = useVerifyResetCode();
  const { mutateAsync: resetPassword, isPending: isResetLoading } = useResetPassword();
  
  const isLoading = isLoginLoading || isRegisterLoading || isForgotLoading || isVerifyLoading || isResetLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        const response = await login({ email, password });
        if (response) {
          setSuccessMessage('تم تسجيل الدخول بنجاح، جاري التوجيه...');
          setIsSuccess(true);
          setTimeout(() => onLogin(), 2000);
        }
      } else if (mode === 'register') {
        const response = await register({
          fullName, email, password,
          weight: Number(weight), height: Number(height), age: Number(age),
          gender, phone: `${countryCode}${phone}`, country,
        });
        if (response && response.token) {
          setSuccessMessage('تم إنشاء حسابك بنجاح، مرحباً بك في أصِل!');
          setIsSuccess(true);
          setTimeout(() => onLogin(), 2000);
        }
      } else if (mode === 'forgot-password') {
        await forgotPassword(email);
        setMode('verify-code');
      } else if (mode === 'verify-code') {
        await verifyCode(resetCode);
        setMode('reset-password');
      } else if (mode === 'reset-password') {
        await resetPassword({ email, newPassword });
        setSuccessMessage('تم إعادة تعيين كلمة المرور بنجاح!');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMode('login');
          setPassword('');
        }, 2000);
      }
    } catch (error) {
      // Errors are handled by the hooks
    }
  };

  const renderHeader = () => {
    switch(mode) {
      case 'login': return { title: 'مرحباً بعودتك', subtitle: 'سجل دخولك للمتابعة' };
      case 'register': return { title: 'انضم إلينا', subtitle: 'أنشئ حسابك الآن' };
      case 'forgot-password': return { title: 'نسيت كلمة المرور', subtitle: 'أدخل بريدك الإلكتروني لإرسال كود الاسترداد' };
      case 'verify-code': return { title: 'التحقق من الكود', subtitle: 'أدخل الكود المرسل إلى بريدك' };
      case 'reset-password': return { title: 'كلمة مرور جديدة', subtitle: 'قم بتعيين كلمة المرور الجديدة لحسابك' };
    }
  };

  const headerText = renderHeader();

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
          className="bg-white rounded-[3rem] p-8 md:p-12 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 z-10"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="inline-flex p-6 bg-green-100 rounded-full mb-6"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-green-600">تم بنجاح!</h2>
              <p className="text-muted-foreground mb-8">{successMessage}</p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                  className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-6"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">{headerText.title}</h2>
                <p className="text-muted-foreground">{headerText.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                
                {mode === 'register' && (
                  <>
                    <div>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="الاسم الكامل" required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="العمر" required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                      </div>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={isLoading} className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50">
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="الوزن (كجم)" required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                      </div>
                      <div className="relative">
                        <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="الطول (سم)" required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                      </div>
                    </div>
                    <div className="relative flex items-center bg-secondary rounded-2xl transition-all disabled:opacity-50 focus-within:ring-2 focus-within:ring-primary">
                      <Phone className="absolute right-4 w-5 h-5 text-muted-foreground z-10" />
                      <select value={countryCode} onChange={(e) => { setCountryCode(e.target.value); setCountry(codeToCountry[e.target.value] || ''); }} disabled={isLoading} style={{ direction: 'ltr' }} className="pr-12 pl-2 py-4 bg-transparent border-none outline-none cursor-pointer text-sm font-bold z-10 w-28">
                        <option value="+966">🇸🇦 +966</option><option value="+20">🇪🇬 +20</option><option value="+971">🇦🇪 +971</option><option value="+965">🇰🇼 +965</option>
                        <option value="+974">🇶🇦 +974</option><option value="+968">🇴🇲 +968</option><option value="+973">🇧🇭 +973</option><option value="+962">🇯🇴 +962</option>
                      </select>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الجوال" required disabled={isLoading} className="flex-1 px-4 py-4 bg-transparent border-none outline-none w-full" />
                    </div>
                  </>
                )}

                {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                  </div>
                )}

                {mode === 'verify-code' && (
                  <div className="relative">
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="الكود (مثال: 123456)" required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                  </div>
                )}

                {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="password" value={mode === 'reset-password' ? newPassword : password} onChange={(e) => mode === 'reset-password' ? setNewPassword(e.target.value) : setPassword(e.target.value)} placeholder={mode === 'reset-password' ? "كلمة المرور الجديدة" : "كلمة المرور"} required disabled={isLoading} className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50" />
                  </div>
                )}

                {mode === 'login' && (
                  <div className="text-left">
                    <button type="button" onClick={() => setMode('forgot-password')} disabled={isLoading} className="text-sm text-primary hover:underline disabled:opacity-50">
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-white rounded-full font-bold shadow-lg transition-all flex justify-center items-center gap-2 bg-gradient-to-br from-primary to-accent disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>جاري التحميل...</span></>
                  ) : (
                    mode === 'login' ? 'تسجيل الدخول' : 
                    mode === 'register' ? 'إنشاء حساب' : 
                    mode === 'forgot-password' ? 'إرسال الكود' :
                    mode === 'verify-code' ? 'تحقق' : 'تعيين كلمة المرور'
                  )}
                </motion.button>
              </form>

              {mode !== 'verify-code' && mode !== 'reset-password' && (
                <div className="text-center mb-6">
                  <button
                    onClick={() => setMode(mode === 'login' || mode === 'forgot-password' ? 'register' : 'login')}
                    disabled={isLoading}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {mode === 'register' ? 'لديك حساب؟ ' : 'ليس لديك حساب؟ '}
                    <span className="font-bold text-primary">
                      {mode === 'register' ? 'سجل الدخول' : 'سجل الآن'}
                    </span>
                  </button>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center mt-6">
                بالمتابعة، أنت توافق على{' '}
                <button className="text-primary hover:underline">شروط الخدمة</button>
                {' '}و{' '}
                <button className="text-primary hover:underline">سياسة الخصوصية</button>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}