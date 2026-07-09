import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { useUpdateResult, useCreateResult, useDeleteResult } from '../../hooks/useResults';
import { compressImage } from '../../../utils/imageCompression';
import type { Result } from '../../api/resultsApi';

interface EditResultModalProps {
  result: Result;
  onClose: () => void;
}

export function EditResultModal({ result, onClose }: EditResultModalProps) {
  const [description, setDescription] = useState(result.description || '');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Existing images from the server
  const [existingImages, setExistingImages] = useState<string[]>(result.images || []);
  const [isLoadingExisting, setIsLoadingExisting] = useState(result.images && result.images.length > 0);
  const [imagesChanged, setImagesChanged] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (!result.images || result.images.length === 0) return;
      try {
        const filePromises = result.images.map(async (url, index) => {
          const res = await fetch(url);
          const blob = await res.blob();
          const fileName = url.substring(url.lastIndexOf('/') + 1) || `image-${index}.jpg`;
          return new File([blob], fileName, { type: blob.type });
        });
        const files = await Promise.all(filePromises);
        setSelectedFiles(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
        setExistingImages([]); // We moved them to selectedFiles
      } catch (err) {
        console.error('Failed to load existing images', err);
      } finally {
        setIsLoadingExisting(false);
      }
    };
    loadImages();
  }, [result.images]);

  const [isCompressing, setIsCompressing] = useState(false);
  
  const { mutateAsync: updateResult } = useUpdateResult();
  const { mutateAsync: deleteResult } = useDeleteResult();
  const { mutateAsync: createResult } = useCreateResult();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPending = isSubmitting || isCompressing || isLoadingExisting;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    
    setIsCompressing(true);
    try {
      const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
      const availableSlots = 5 - existingImages.length;
      const combined = [...selectedFiles, ...compressedFiles].slice(0, availableSlots);
      setSelectedFiles(combined);
      
      previews.forEach(p => URL.revokeObjectURL(p));
      setPreviews(combined.map(f => URL.createObjectURL(f)));
      setImagesChanged(true);
    } catch (error) {
      console.error('Error compressing images', error);
    } finally {
      setIsCompressing(false);
      e.target.value = ''; 
    }
  };

  const removeNewFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    setImagesChanged(true);
  };

  const removeExistingImage = (index: number) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
    setImagesChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (imagesChanged) {
        // Backend does not accept images in PATCH. 
        // We must delete the old result and create a new one with the combined files.
        await deleteResult(result.id);
        await createResult({
          description,
          files: selectedFiles,
        });
      } else {
        // Only description changed, use standard PATCH
        await updateResult({
          id: result.id,
          payload: { description },
        });
      }
      onClose();
    } catch (err) {
      console.error('Failed to update result', err);
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-2xl font-bold">تعديل النتيجة</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">وصف الحالة والتطور</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
                placeholder="اكتب وصفاً لحالة المريض والتطور الذي حدث..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-4">
                صور الحالة (الحد الأقصى 5 صور)
                <span className="text-muted-foreground font-normal mr-2">
                  (متبقي {5 - (existingImages.length + selectedFiles.length)})
                </span>
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {isLoadingExisting && (
                  <div className="col-span-full flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
                {/* Show Existing Images (if any left) */}
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-secondary group">
                    <img src={img} alt={`existing ${index}`} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">مرفوعة مسبقاً</div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Show New Previews */}
                {previews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-secondary group">
                    <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">مختارة</div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Add File Button */}
                {(existingImages.length + selectedFiles.length) < 5 && (
                  <label className="relative aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer hover:bg-primary/5 transition-all flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-xl text-primary font-bold">+</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">إضافة صورة</span>
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
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isPending || !description.trim()}
                className="px-8 py-3 bg-gradient-to-br from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
