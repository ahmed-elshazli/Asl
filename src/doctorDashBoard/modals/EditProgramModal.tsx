import { motion } from 'motion/react';
import { X, Loader2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTrainingProgram, useUpdateTrainingProgram } from '../../workOuts/hooks/useTrainingPrograms';
import { ProgramForm } from './ProgramForm';

export function EditProgramModal({ programId, onClose }: { programId: string, onClose: () => void }) {
  const { data: program, isLoading } = useTrainingProgram(programId);
  const { mutate: updateProgram, isPending } = useUpdateTrainingProgram();

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

  useEffect(() => {
    if (program) {
      let mappedCategory = (program.category || 'strength').toLowerCase();
      if (mappedCategory === 'stretching') mappedCategory = 'flexibility';
      
      let mappedLevel = (program.level || 'beginner').toLowerCase();
      if (mappedLevel === 'مبتدئ') mappedLevel = 'beginner';
      if (mappedLevel === 'متوسط') mappedLevel = 'intermediate';
      if (mappedLevel === 'متقدم') mappedLevel = 'advanced';

      setForm({
        title: program.title || program.name || '',
        description: program.description || '',
        level: mappedLevel,
        category: mappedCategory,
        duration: program.duration || 4,
        minCalories: program.minCalories || 0,
        maxCalories: program.maxCalories || 0,
        isActive: program.isActive ?? true,
        isPremium: program.isPremium ?? false,
        exercises: program.exercises?.map((ex: any, index: number) => {
          let exId = '';
          if (typeof ex === 'string') exId = ex;
          else if (ex.exerciseId && typeof ex.exerciseId === 'object') exId = ex.exerciseId._id;
          else if (ex.exerciseId && typeof ex.exerciseId === 'string') exId = ex.exerciseId;
          else if (ex._id) exId = ex._id;
          else exId = ex;

          return {
            exerciseId: exId,
            uniqueKey: `loaded-${index}-${Math.random().toString(36).substr(2, 5)}`
          };
        }) || []
      });
    }
  }, [program]);

  const handleSubmit = () => {
    if (!form.title.trim()) return alert('الرجاء إدخال اسم البرنامج');
    
    const payload = {
      ...form,
      exercises: form.exercises.map((item, index) => ({ exerciseId: item.exerciseId, order: index + 1 }))
    };

    updateProgram({ id: programId, payload }, {
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
            <h2 className="text-xl font-bold">تعديل البرنامج التدريبي</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <ProgramForm form={form} onChange={setForm} />
          )}
        </div>

        <div className="p-6 border-t border-primary/10 flex-shrink-0 bg-secondary/50">
          <button
            onClick={handleSubmit}
            disabled={isPending || isLoading || !form.title.trim()}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-primary/25"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تحديث البرنامج'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
