import { motion, AnimatePresence } from 'motion/react';
import { Info, Save, Loader2, Sparkles, Star, MessageCircle, Upload, X, AlertTriangle } from 'lucide-react';

const FacebookIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import { useState, useEffect } from 'react';
import { useAboutUs, useSaveAboutUs } from '../../hooks/useAboutUs';
import { compressImage, urlToFile } from '../../../lib/imageCompression';

export function AboutUsSection() {
  const { data: aboutUsData, isLoading } = useAboutUs();
  const { mutate: saveAboutUs, isPending } = useSaveAboutUs();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  const [founderImageFile, setFounderImageFile] = useState<File | null>(null);
  const [removeFounderImage, setRemoveFounderImage] = useState(false);
  const [certificationImageFiles, setCertificationImageFiles] = useState<File[]>([]);
  const [existingCertifications, setExistingCertifications] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    if (aboutUsData) {
      setTitle(aboutUsData.title || '');
      setDescription(aboutUsData.description || '');
      setEmail(aboutUsData.email || '');
      setFacebook(aboutUsData.facebook || '');
      setInstagram(aboutUsData.instagram || '');
      if (aboutUsData.tiktok) setTiktok(aboutUsData.tiktok);
      if (aboutUsData.whatsapp) setWhatsapp(aboutUsData.whatsapp);
      if (aboutUsData.certificationImages) setExistingCertifications(aboutUsData.certificationImages);
      setRemoveFounderImage(false);
    }
  }, [aboutUsData]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      import('sonner').then(({ toast }) => toast.error('يجب إدخال العنوان والوصف على الأقل.'));
      return;
    }
    const payload: any = { 
      title: title.trim(), 
      description: description.trim() 
    };
    if (email.trim()) payload.email = email.trim();
    if (facebook.trim()) payload.facebook = facebook.trim();
    if (instagram.trim()) payload.instagram = instagram.trim();
    if (tiktok.trim()) payload.tiktok = tiktok.trim();
    if (whatsapp.trim()) payload.whatsapp = whatsapp.trim();
    
    if (founderImageFile) {
      payload.founderImage = founderImageFile;
    }
    // ملاحظة: تم إزالة إرسال قيمة فارغة ("") لأن الباك إند يرفضها ويطلب أن تكون رابطاً صحيحاً.
    
    // إذا كان هناك تغيير في الصور (إضافة جديد أو مسح قديم)
    if (certificationImageFiles.length > 0 || existingCertifications.length !== (aboutUsData?.certificationImages?.length || 0)) {
      setIsCompressing(true);
      try {
        // تحميل الصور القديمة وتحويلها لملفات (Files) لكي يتقبلها الباك إند مع الجديدة
        const oldFiles = await Promise.all(
          existingCertifications.map((url, i) => urlToFile(url, `existing_cert_${i}.jpg`))
        );
        payload.certificationImages = [...oldFiles, ...certificationImageFiles];
      } catch (err) {
        console.error("Failed to convert old images to files", err);
      } finally {
        setIsCompressing(false);
      }
    }
    
    saveAboutUs(payload, {
      onSuccess: () => {
        setFounderImageFile(null);
        setCertificationImageFiles([]);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold text-lg">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">من نحن (About Us)</h1>
          <p className="text-muted-foreground">قم بإدارة محتوى صفحة "من نحن" التي تظهر للمستخدمين</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Info className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-primary/10 space-y-6">
        
        {/* عنوان المنصة */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            العنوان (Title)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-accent focus:bg-white outline-none transition-all"
            placeholder="مثال: منصة أصِل للصحة والتغذية..."
          />
        </div>

        {/* وصف المنصة */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            الوصف والتفاصيل (Description)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-primary focus:bg-white outline-none transition-all resize-none custom-scrollbar"
            placeholder="اكتب نبذة عن المنصة والخدمات المقدمة..."
          />
        </div>

        {/* البريد الإلكتروني للتواصل */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            البريد الإلكتروني (Email)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-yellow-500 focus:bg-white outline-none transition-all"
            placeholder="example@domain.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facebook */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <FacebookIcon className="w-4 h-4 text-blue-600" />
              فيسبوك (Facebook URL)
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-blue-600 focus:bg-white outline-none transition-all"
              placeholder="https://facebook.com/..."
            />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-pink-600" />
              انستجرام (Instagram URL)
            </label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-pink-600 focus:bg-white outline-none transition-all"
              placeholder="https://instagram.com/..."
            />
          </div>

          {/* TikTok */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="font-bold text-black text-lg mr-1 leading-none">♪</span>
              تيك توك (TikTok URL)
            </label>
            <input
              type="url"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-black focus:bg-white outline-none transition-all"
              placeholder="https://tiktok.com/@..."
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              واتساب (رابط الواتساب)
            </label>
            <input
              type="url"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-green-500 focus:bg-white outline-none transition-all"
              placeholder="https://wa.me/20123456789"
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="pt-8 border-t border-secondary/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            إدارة الصور والوسائط
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Founder Image */}
            <div className="bg-secondary/20 p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all">
              <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-primary" />
                صورة المؤسس (Founder Image)
              </label>
              
              <div className="flex flex-col gap-4">
                <label className="cursor-pointer bg-white hover:bg-primary/5 border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-6 text-center transition-all group">
                  <Upload className="w-8 h-8 mx-auto text-primary/50 group-hover:text-primary mb-2 transition-colors" />
                  <span className="text-sm font-semibold text-primary/70 group-hover:text-primary transition-colors">اضغط لاختيار صورة (يتم ضغطها تلقائياً)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        setIsCompressing(true);
                        try {
                          const compressed = await compressImage(e.target.files[0]);
                          setFounderImageFile(compressed);
                        } finally {
                          setIsCompressing(false);
                        }
                      }
                    }}
                  />
                </label>
                
                {(founderImageFile || (!removeFounderImage && aboutUsData?.founderImage)) && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground font-bold mb-2">الصورة الحالية:</p>
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg mx-auto group">
                      <img 
                        src={founderImageFile ? URL.createObjectURL(founderImageFile) : aboutUsData?.founderImage} 
                        alt="Founder Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button 
                        onClick={() => {
                          setFounderImageFile(null);
                          if (!founderImageFile && aboutUsData?.founderImage) {
                            setShowDeleteWarning(true);
                          }
                        }} 
                        className="absolute inset-0 bg-red-500/80 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">إلغاء</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certification Images */}
            <div className="bg-secondary/20 p-6 rounded-3xl border border-accent/5 hover:border-accent/20 transition-all">
              <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                صور الشهادات (Certifications)
              </label>
              <div className="flex flex-col gap-4">
                <label className="cursor-pointer bg-white hover:bg-accent/5 border-2 border-dashed border-accent/30 hover:border-accent rounded-2xl p-6 text-center transition-all group">
                  <Upload className="w-8 h-8 mx-auto text-accent/50 group-hover:text-accent mb-2 transition-colors" />
                  <span className="text-sm font-semibold text-accent/70 group-hover:text-accent transition-colors">اضغط لاختيار صور متعددة</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    onChange={async (e) => {
                      if (e.target.files) {
                        setIsCompressing(true);
                        try {
                          const files = Array.from(e.target.files);
                          const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
                          setCertificationImageFiles(prev => [...prev, ...compressedFiles]);
                        } finally {
                          setIsCompressing(false);
                        }
                      }
                    }}
                  />
                </label>
                
                {/* Preview Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                  {/* Newly selected files */}
                  {certificationImageFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm group">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setCertificationImageFiles(prev => prev.filter((_, i) => i !== idx))} 
                          className="bg-red-500 text-white rounded-full p-1.5 hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg shadow-sm">جديد</span>
                    </div>
                  ))}
                  {/* Existing images */}
                  {existingCertifications.map((imgUrl: string, idx: number) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm group">
                      <img src={imgUrl} alt="Current" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setExistingCertifications(prev => prev.filter((_, i) => i !== idx))} 
                          className="bg-red-500 text-white rounded-full p-1.5 hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-secondary flex justify-end">
          <motion.button
            whileHover={!isPending && !isCompressing ? { scale: 1.02 } : {}}
            whileTap={!isPending && !isCompressing ? { scale: 0.98 } : {}}
            onClick={handleSave}
            disabled={isPending || isCompressing}
            className={`px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all ${isPending || isCompressing ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-xl'}`}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isCompressing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isPending ? 'جاري الحفظ...' : isCompressing ? 'جاري ضغط الصور...' : 'حفظ التغييرات'}
          </motion.button>
        </div>
      </div>

      {/* Delete Warning Popup */}
      <AnimatePresence>
        {showDeleteWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-center mb-2">لا يمكن مسح الصورة الحالية</h3>
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                النظام لا يدعم إزالة صورة المؤسس وتركها فارغة. إذا كنت ترغب في تغييرها، يرجى <strong>رفع صورة جديدة</strong> وسيقوم النظام باستبدالها تلقائياً.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteWarning(false)}
                className="w-full py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-2xl transition-colors"
              >
                حسناً، فهمت
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
