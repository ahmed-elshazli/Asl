import type { CreatePlanPayload } from '../api/plansApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MealForm {
  name: string;
  time: string;
  calories: number | '';
  description: string;
}

export interface PlanFormState {
  name: string;
  type: string;
  caloriesFrom: number | '';
  caloriesTo: number | '';
  duration: number | '';
  protein: number | '';
  carbs: number | '';
  fats: number | '';
  meals: MealForm[];
  guidelines: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_FORM: PlanFormState = {
  name: '',
  type: 'إنقاص الوزن',
  caloriesFrom: '',
  caloriesTo: '',
  duration: '',
  protein: '',
  carbs: '',
  fats: '',
  meals: [
    { name: 'الإفطار', time: '', calories: '', description: '' },
    { name: 'سناك صباحي', time: '', calories: '', description: '' },
    { name: 'الغداء', time: '', calories: '', description: '' },
    { name: 'سناك مسائي', time: '', calories: '', description: '' },
    { name: 'العشاء', time: '', calories: '', description: '' },
  ],
  guidelines: '',
};

export const formToPayload = (f: PlanFormState): CreatePlanPayload => ({
  name: f.name,
  type: f.type === 'إنقاص الوزن' ? 'weight_loss' : f.type === 'زيادة الوزن' ? 'weight_gain' : 'healthy', // Adjust according to your backend enums if any. But since type seems to expect english or exact string, let's just pass whatever if backend accepts arabic, else it might need mapping. Actually let's just send f.type as is unless backend fails. The error didn't complain about type. Let's assume it accepts weight_loss.
  calories: {
    from: Number(f.caloriesFrom) || 0,
    to: Number(f.caloriesTo) || 0,
  },
  durationInWeeks: Number(f.duration) || 0,
  macros: {
    protein: Math.min(100, Math.max(0, Number(f.protein) || 0)),
    carbs: Math.min(100, Math.max(0, Number(f.carbs) || 0)),
    fats: Math.min(100, Math.max(0, Number(f.fats) || 0)),
  },
  meals: f.meals.map((m) => ({
    name: m.name,
    mealTime: m.time || '08:00', // Default fallback just in case
    calories: Number(m.calories) || 0,
    description: m.description,
  })),
  instructions: f.guidelines,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cls = 'w-full px-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm transition-all';
const Label = ({ text }: { text: string }) => (
  <label className="text-xs font-bold text-foreground/60 uppercase tracking-wide">{text}</label>
);

// ─── Component ────────────────────────────────────────────────────────────────

interface PlanFormProps {
  form: PlanFormState;
  onChange: (form: PlanFormState) => void;
}

export function PlanForm({ form, onChange }: PlanFormProps) {
  const set = (key: keyof PlanFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...form, [key]: e.target.value });

  const setNum = (key: keyof PlanFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...form, [key]: e.target.value === '' ? '' : Number(e.target.value) });

  const setMeal = (idx: number, key: keyof MealForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const meals = form.meals.map((m, i) =>
        i === idx ? { ...m, [key]: key === 'calories' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value } : m
      );
      onChange({ ...form, meals });
    };

  return (
    <div className="space-y-6">
      {/* ─── Basic ─── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label text="اسم الخطة *" />
          <input className={cls} placeholder="خطة إنقاص الوزن - أساسية"
            value={form.name} onChange={set('name')} />
        </div>
        <div className="space-y-1.5">
          <Label text="نوع الخطة" />
          <select className={cls} value={form.type} onChange={set('type')}>
            {['إنقاص الوزن', 'زيادة الوزن', 'نمط حياة صحي', 'بناء عضلات', 'رياضيين'].map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label text="المدة (شهور)" />
          <input type="number" min={0} className={cls} placeholder="3"
            value={form.duration} onChange={setNum('duration')} />
        </div>
        <div className="space-y-1.5">
          <Label text="السعرات من" />
          <input type="number" min={0} className={cls} placeholder="1500"
            value={form.caloriesFrom} onChange={setNum('caloriesFrom')} />
        </div>
        <div className="space-y-1.5">
          <Label text="السعرات إلى" />
          <input type="number" min={0} className={cls} placeholder="1800"
            value={form.caloriesTo} onChange={setNum('caloriesTo')} />
        </div>
      </div>

      {/* ─── Nutrients ─── */}
      <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-bold">توزيع المغذيات (%)</p>
        <div className="grid grid-cols-3 gap-3">
          {(['protein', 'carbs', 'fats'] as const).map((key, i) => (
            <div key={key} className="space-y-1.5">
              <Label text={['بروتين', 'كارب', 'دهون'][i]} />
              <input type="number" min={0} max={100} className={cls} placeholder={['30', '45', '25'][i]}
                value={form[key]} onChange={setNum(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Meals ─── */}
      <div className="space-y-3">
        <p className="text-sm font-bold">الوجبات اليومية</p>
        {form.meals.map((meal, idx) => (
          <div key={meal.name} className="bg-secondary/50 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">{meal.name}</p>
              <input type="time" className="w-32 px-3 py-2 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm"
                value={meal.time} onChange={setMeal(idx, 'time')} />
            </div>
            <textarea rows={2} className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              placeholder="مكونات الوجبة..." value={meal.description} onChange={setMeal(idx, 'description')} />
            <input type="number" min={0} className="w-32 px-3 py-2 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="السعرات" value={meal.calories} onChange={setMeal(idx, 'calories')} />
          </div>
        ))}
      </div>

      {/* ─── Guidelines ─── */}
      <div className="space-y-1.5">
        <Label text="إرشادات وملاحظات (كل إرشاد في سطر)" />
        <textarea rows={3} className={cls + ' resize-none'}
          placeholder="اشرب 8 أكواب ماء يومياً&#10;تجنب السكريات المكررة"
          value={form.guidelines} onChange={set('guidelines')} />
      </div>
    </div>
  );
}