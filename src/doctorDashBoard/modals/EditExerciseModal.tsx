import { motion } from 'motion/react';
import { X, Loader2, Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useExercise, useUpdateExercise } from '../../workOuts/hooks/useExercises';
import { ExerciseForm } from './ExerciseForm';


export function EditExerciseModal({ exerciseId, onClose }: { exerciseId: string, onClose: () => void }) {
  const { data: exercise, isLoading } = useExercise(exerciseId);
  const { mutate: updateExercise, isPending } = useUpdateExercise();
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 0,
    calories: 0,
    existingImages: [] as string[],
    newImages: [] as { file: File, previewUrl: string }[]
  });

  useEffect(() => {
    if (exercise) {
      setForm({
        title: exercise.title || exercise.name || '',
        description: exercise.description || '',
        duration: exercise.duration || 0,
        calories: exercise.calories || 0,
        existingImages: exercise.images || [],
        newImages: []
      });
    }
  }, [exercise]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert('الرجاء إدخال اسم التمرين');
    
    setIsUploading(true);
    
    // سنستخدم formData فقط إذا كان هناك صور جديدة أو إذا كان هناك صور قديمة ونريد تحديث التمرين (لأن الباك إند يمسح القديم)
    // ولكن لتجنب رفع الصور القديمة في كل مرة، سنقوم بذلك فقط إذا تم إضافة صور جديدة، أو إذا تم حذف صور قديمة!
    const originalImagesCount = exercise?.images?.length || 0;
    const hasDeletedOldImages = form.existingImages.length !== originalImagesCount;
    const hasNewImages = form.newImages.length > 0;

    if (hasNewImages || hasDeletedOldImages) {
      const formData = new FormData();
      formData.append('title', form.title);
      if (form.description) formData.append('description', form.description);
      formData.append('duration', form.duration.toString());
      formData.append('calories', form.calories.toString());
      
      // الباك إند يرفض إرسال روابط الصور القديمة ويمسحها عند رفع صور جديدة.
      // كحل بديل (Hack) سنقوم بتحميل الصور القديمة وتحويلها لملفات ورفعها مع الجديدة.
      if (form.existingImages && form.existingImages.length > 0) {
        for (const url of form.existingImages) {
          try {
            const res = await fetch(url);
            const blob = await res.blob();
            const filename = url.split('/').pop() || 'existing.jpg';
            const file = new File([blob], filename, { type: blob.type });
            formData.append('files', file);
          } catch (e) {
            console.error("فشل في تحميل الصورة القديمة:", e);
          }
        }
      }
      
      // الباك إند يتوقع الصور في حقل باسم 'files'
      form.newImages.forEach(item => formData.append('files', item.file));

      updateExercise({ id: exerciseId, payload: formData as any }, { 
        onSuccess: onClose,
        onSettled: () => setIsUploading(false)
      });
    } else {
      updateExercise({ id: exerciseId, payload: {
        title: form.title,
        description: form.description,
        duration: form.duration,
        calories: form.calories
      } }, { 
        onSuccess: onClose,
        onSettled: () => setIsUploading(false)
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="bg-primary p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">تعديل التمرين</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <ExerciseForm form={form} onChange={setForm} />
          )}
        </div>

        <div className="p-6 border-t border-primary/10 flex-shrink-0 bg-secondary/50">
          <button
            onClick={handleSubmit}
            disabled={isPending || isUploading || isLoading || !form.title.trim()}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-primary/25"
          >
            {isPending || isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تحديث التمرين'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
