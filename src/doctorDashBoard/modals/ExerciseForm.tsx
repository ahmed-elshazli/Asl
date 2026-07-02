import { Camera, X, Loader2, Maximize2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-muted-foreground mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ExerciseForm({ form, onChange }: { form: any; onChange: (f: any) => void }) {
  const cls = {
    input: "w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all",
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // دالة لضغط الصور باستخدام Canvas قبل رفعها
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // لو الصورة مش من النوع المدعوم للضغط، نرجعها زي ما هي
      if (!file.type.startsWith('image/')) return resolve(file);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          // تصغير الأبعاد مع الحفاظ على نسبة العرض للارتفاع
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // تحويل الكانفاس لملف JPEG بجودة 80%
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsCompressing(true);
      const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
      
      const newImagesItems = compressedFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      
      onChange({ ...form, newImages: [...(form.newImages || []), ...newImagesItems] });
      setIsCompressing(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNew = (index: number) => {
    const updated = [...form.newImages];
    URL.revokeObjectURL(updated[index].previewUrl);
    updated.splice(index, 1);
    onChange({ ...form, newImages: updated });
  };

  const removeExisting = (index: number) => {
    const updated = [...form.existingImages];
    updated.splice(index, 1);
    onChange({ ...form, existingImages: updated });
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Area */}
      <div>
        <h3 className="block text-sm font-bold text-muted-foreground mb-3">صور التمرين</h3>
        
        <input 
          type="file" 
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/svg+xml,image/avif,image/heic,image/heif" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
        />

        <div className="flex flex-wrap gap-4 mb-2">
          {/* صور موجودة مسبقاً */}
          {form.existingImages?.map((url: string, i: number) => (
            <div key={`ext-${i}`} className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-sm group">
              <img src={url} alt="Exercise" className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewImage(url)} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  type="button" onClick={() => setPreviewImage(url)}
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:scale-110 hover:bg-white/40 transition-all shadow-lg"
                  title="تكبير الصورة"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button 
                  type="button" onClick={() => removeExisting(i)}
                  className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="حذف الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* صور جديدة تم اختيارها */}
          {form.newImages?.map((item: any, i: number) => (
            <div key={`new-${i}`} className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-sm border-2 border-primary group">
              <img src={item.previewUrl} alt="New Exercise" className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewImage(item.previewUrl)} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  type="button" onClick={() => setPreviewImage(item.previewUrl)}
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:scale-110 hover:bg-white/40 transition-all shadow-lg"
                  title="تكبير الصورة"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button 
                  type="button" onClick={() => removeNew(i)}
                  className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="حذف الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">جديد</div>
            </div>
          ))}

          {/* زر إضافة صورة */}
          <button 
            type="button"
            disabled={isCompressing}
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/30 flex flex-col items-center justify-center text-primary/70 hover:bg-secondary/70 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {isCompressing ? (
              <>
                <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                <span className="text-[10px] font-bold text-center">جاري الضغط...</span>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">إضافة صور</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-[10px] text-muted-foreground/70 leading-tight">
          الأنواع المدعومة: JPG, PNG, WEBP, GIF, SVG, AVIF, BMP, TIFF, HEIC, HEIF
          <br/>
          * يتم ضغط الصور تلقائياً لتقليل الحجم قبل الرفع.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="اسم التمرين *">
          <input className={cls.input} placeholder="مثال: الضغط" value={form.title} onChange={e => onChange({ ...form, title: e.target.value })} />
        </Field>
        <Field label="السعرات الحرارية">
          <input type="number" min="0" className={cls.input} placeholder="مثال: 50" value={form.calories} onChange={e => onChange({ ...form, calories: Number(e.target.value) })} />
        </Field>
      </div>

      <Field label="الوصف">
        <textarea className={`${cls.input} resize-none h-24`} placeholder="اشرح طريقة التمرين..." value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} />
      </Field>

      <Field label="المدة (دقائق)">
        <input type="number" min="0" className={cls.input} value={form.duration} onChange={e => onChange({ ...form, duration: Number(e.target.value) })} />
      </Field>

      {/* Modal التكبير */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-black/50"
            >
              <img src={previewImage} alt="Preview" className="w-full h-full object-contain max-h-[90vh]" />
              <button 
                type="button"
                onClick={() => setPreviewImage(null)} 
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm shadow-xl border border-white/10 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
