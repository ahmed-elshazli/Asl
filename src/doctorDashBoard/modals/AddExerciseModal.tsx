import { motion } from 'motion/react';
import { X, Loader2, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { useCreateExercise } from '../../workOuts/hooks/useExercises';
import { ExerciseForm } from './ExerciseForm';

export function AddExerciseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 0,
    calories: 0,
    existingImages: [] as string[],
    newImages: [] as { file: File, previewUrl: string }[]
  });

  const { mutate: createExercise, isPending } = useCreateExercise();

  const handleSubmit = () => {
    if (!form.title.trim()) return alert('الرجاء إدخال اسم التمرين');
    
    if (form.newImages.length > 0) {
      const formData = new FormData();
      formData.append('title', form.title);
      if (form.description) formData.append('description', form.description);
      formData.append('duration', form.duration.toString());
      formData.append('calories', form.calories.toString());
      
      // الباك إند يتوقع الصور في حقل باسم 'files' وليس 'image'
      form.newImages.forEach(item => formData.append('files', item.file));

      createExercise(formData as any, { onSuccess: onClose });
    } else {
      createExercise({
        title: form.title,
        description: form.description,
        duration: form.duration,
        calories: form.calories
      }, { onSuccess: onClose });
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
            <h2 className="text-xl font-bold">إضافة تمرين جديد</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <ExerciseForm form={form} onChange={setForm} />
        </div>

        <div className="p-6 border-t border-primary/10 flex-shrink-0 bg-secondary/50">
          <button
            onClick={handleSubmit}
            disabled={isPending || !form.title.trim()}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-primary/25"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ التمرين'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
