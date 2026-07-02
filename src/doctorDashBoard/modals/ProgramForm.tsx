import { Zap, Plus, Trash2 } from 'lucide-react';
import { useExercises } from '../../workOuts/hooks/useExercises';

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

export function ProgramForm({ form, onChange }: { form: any; onChange: (f: any) => void }) {
  const cls = {
    input: "w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all",
  };

  const { data: exercises } = useExercises();
  const availableExercises = exercises || [];

  const addExercise = (exerciseId: string) => {
    // نسمح بإضافة نفس التمرين أكثر من مرة (مثلما يرجع من الباك إند)
    onChange({ 
      ...form, 
      exercises: [...form.exercises, { exerciseId, uniqueKey: Math.random().toString(36).substr(2, 9) }] 
    });
  };

  const removeExercise = (indexToRemove: number) => {
    onChange({ 
      ...form, 
      exercises: form.exercises.filter((_: any, index: number) => index !== indexToRemove) 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="اسم البرنامج *">
          <input className={cls.input} placeholder="مثال: ضخامة عضلية" value={form.title} onChange={e => onChange({ ...form, title: e.target.value })} />
        </Field>
        <Field label="المستوى (Level) *">
          <select className={cls.input} value={form.level} onChange={e => onChange({ ...form, level: e.target.value })}>
            <option value="beginner">مبتدئ (Beginner)</option>
            <option value="intermediate">متوسط (Intermediate)</option>
            <option value="advanced">متقدم (Advanced)</option>
          </select>
        </Field>
        <Field label="الفئة (Category) *">
          <select className={cls.input} value={form.category} onChange={e => onChange({ ...form, category: e.target.value })}>
            <option value="strength">قوة (Strength)</option>
            <option value="cardio">كارديو (Cardio)</option>
            <option value="flexibility">مرونة (Flexibility)</option>
            <option value="rehabilitation">تأهيل (Rehabilitation)</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="المدة (أسابيع) *">
          <input type="number" min="1" className={cls.input} value={form.duration} onChange={e => onChange({ ...form, duration: Number(e.target.value) })} />
        </Field>
        <Field label="الحد الأدنى للسعرات">
          <input type="number" min="0" className={cls.input} value={form.minCalories} onChange={e => onChange({ ...form, minCalories: Number(e.target.value) })} />
        </Field>
        <Field label="الحد الأقصى للسعرات">
          <input type="number" min="0" className={cls.input} value={form.maxCalories} onChange={e => onChange({ ...form, maxCalories: Number(e.target.value) })} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6 p-4 bg-secondary/50 rounded-2xl border border-primary/10">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={form.isActive} 
            onChange={e => onChange({ ...form, isActive: e.target.checked })}
            className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
          />
          <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">برنامج مفعل (Active)</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={form.isPremium} 
            onChange={e => onChange({ ...form, isPremium: e.target.checked })}
            className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
          />
          <span className="font-bold text-gray-700 group-hover:text-amber-500 transition-colors">برنامج مدفوع (Premium)</span>
        </label>
      </div>

      <Field label="الوصف">
        <textarea className={`${cls.input} resize-none h-24`} placeholder="اشرح هدف البرنامج..." value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} />
      </Field>

      {/* Exercises Selection */}
      <div className="border border-primary/10 rounded-3xl p-4 bg-white shadow-sm space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> تمارين البرنامج
        </h3>
        
        {/* Selected Exercises */}
        {form.exercises.length > 0 && (
          <div className="flex flex-col gap-2">
            {form.exercises.map((item: any, index: number) => {
              const exId = item.exerciseId || item;
              const ex = availableExercises.find(e => e._id === exId);
              return (
                <div key={item.uniqueKey || index} className="flex items-center justify-between bg-primary/5 border border-primary/10 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-bold text-primary">{ex?.title || ex?.name || 'تمرين غير معروف'}</span>
                  </div>
                  <button type="button" onClick={() => removeExercise(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Exercise */}
        <div className="pt-4 border-t border-primary/5">
          <label className="block text-sm font-bold text-muted-foreground mb-3">إضافة تمرين للبرنامج (يمكنك تكرار التمارين):</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
            {availableExercises.map(ex => (
              <div key={ex._id} className="flex items-center justify-between p-3 rounded-xl bg-secondary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20">
                <span className="text-sm font-bold truncate pr-2">{ex.title || ex.name}</span>
                <button type="button" onClick={() => addExercise(ex._id)} className="p-2 bg-white rounded-lg text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
            {availableExercises.length === 0 && (
              <p className="text-xs text-muted-foreground text-center col-span-full py-2">لا توجد تمارين متاحة، قم بإضافة تمارين أولاً.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
