import { motion } from 'motion/react';
import { X, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';
import { useCreateTrainingProgram } from '../../workOuts/hooks/useTrainingPrograms';
import { ProgramForm } from './ProgramForm';

export function AddProgramModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'beginner',
    category: 'strength',
    duration: 4,
    minCalories: 0,
    maxCalories: 0,
    isActive: true,
    isPremium: false,
    exercises: [] as { exerciseId: string, uniqueKey: string }[]
  });

  const { mutate: createProgram, isPending } = useCreateTrainingProgram();

  const handleSubmit = () => {
    if (!form.title.trim()) return alert('الرجاء إدخال اسم البرنامج');
    
    const payload = {
      ...form,
      exercises: form.exercises.map((item, index) => ({ exerciseId: item.exerciseId, order: index + 1 }))
    };

    createProgram(payload, {
      onSuccess: onClose
    });
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
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">إضافة برنامج تدريبي جديد</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <ProgramForm form={form} onChange={setForm} />
        </div>

        <div className="p-6 border-t border-primary/10 flex-shrink-0 bg-secondary/50">
          <button
            onClick={handleSubmit}
            disabled={isPending || !form.title.trim()}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-primary/25"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ البرنامج'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
