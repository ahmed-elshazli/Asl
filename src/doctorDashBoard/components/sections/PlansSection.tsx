// // src/doctorDashBoard/components/sections/PlansSection.tsx
// import { motion } from 'motion/react';
// import { Plus, Users, Apple, Edit, Trash2 } from 'lucide-react';

// interface PlansSectionProps {
//   setShowAddPlanModal: (show: boolean) => void;
//   setShowAssignPlanModal: (show: boolean) => void;
// }

// export function PlansSection({ setShowAddPlanModal, setShowAssignPlanModal }: PlansSectionProps) {
//   const plans = [
//     { name: 'خطة إنقاص الوزن - أساسية', patients: 45, calories: '1500-1800', type: 'إنقاص وزن' },
//     { name: 'خطة الكيتو المتقدمة', patients: 28, calories: '1600-1900', type: 'إنقاص وزن' },
//     { name: 'خطة بناء العضلات', patients: 32, calories: '2800-3200', type: 'زيادة وزن' },
//   ];

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-4xl font-bold mb-2">الخطط الغذائية</h1>
//           <p className="text-muted-foreground">إدارة وإنشاء خطط غذائية مخصصة</p>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={() => setShowAddPlanModal(true)} className="px-4 py-3 bg-primary text-white rounded-full font-semibold flex items-center gap-2">
//             <Plus className="w-4 h-4" /> خطة جديدة
//           </button>
//           <button onClick={() => setShowAssignPlanModal(true)} className="px-4 py-3 bg-white border border-primary text-primary rounded-full font-semibold flex items-center gap-2">
//             <Users className="w-4 h-4" /> تعيين خطة
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {plans.map((plan, idx) => (
//           <div key={idx} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg flex flex-col">
//             <div className="flex justify-between mb-4">
//               <div className="p-3 bg-primary rounded-2xl text-white"><Apple /></div>
//               <div className="flex gap-2"><Edit className="w-4 h-4 text-primary" /><Trash2 className="w-4 h-4 text-red-500" /></div>
//             </div>
//             <h3 className="font-bold text-lg">{plan.name}</h3>
//             <p className="text-sm text-muted-foreground mb-4">{plan.type}</p>
//             <div className="space-y-2 mt-auto">
//               <div className="flex justify-between text-sm"><span>عدد المرضى</span> <span className="font-bold">{plan.patients}</span></div>
//               <div className="flex justify-between text-sm"><span>السعرات</span> <span className="font-bold">{plan.calories}</span></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }