import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, UploadCloud, XCircle } from 'lucide-react';
import { useCreateResult } from '../../hooks/useResults';
import { compressImage } from '../../../utils/imageCompression';

interface AddResultModalProps {
  onClose: () => void;
}

export function AddResultModal({ onClose }: AddResultModalProps) {
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [isCompressing, setIsCompressing] = useState(false);

  const { mutate: createResult, isPending: isSubmitting } = useCreateResult();

  const isPending = isSubmitting || isCompressing;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsCompressing(true);
    try {
      const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
      const combined = [...selectedFiles, ...compressedFiles].slice(0, 5);
      setSelectedFiles(combined);
      
      previews.forEach(p => URL.revokeObjectURL(p));
      setPreviews(combined.map(f => URL.createObjectURL(f)));
    } catch (error) {
      console.error('Error compressing images', error);
    } finally {
      setIsCompressing(false);
      e.target.value = ''; 
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createResult(
      {
        description,
        files: selectedFiles,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
      >
        <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-secondary/30">
          <h2 className="text-2xl font-bold">إضافة نتيجة جديدة</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">الوصف / التفاصيل</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary resize-none h-32"
              placeholder="اكتب قصة النجاح أو تفاصيل التطور..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex justify-between items-center">
              <span>الصور المرفقة (بحد أقصى 5 صور)</span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">{selectedFiles.length} / 5</span>
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-secondary">
                  <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {selectedFiles.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary/60 hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">إضافة صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            {selectedFiles.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">يفضل إضافة صورة واحدة على الأقل توضح النتيجة.</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending || !description.trim() || selectedFiles.length === 0}
              className="px-8 py-3 bg-gradient-to-br from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ ونشر'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
