// // src/doctorDashBoard/components/sections/AnalyticsSection.tsx
// import { motion } from 'motion/react';
// import { Filter, Download, Award } from 'lucide-react';
// import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
// import { stats, monthlyData, recentPatients } from '../doctorDashboardData';

// export function AnalyticsSection() {
//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-4xl font-bold">الإحصائيات</h1>
//         </div>
//         <div className="flex gap-3">
//           <button className="px-4 py-2 bg-white rounded-full flex items-center gap-2 border shadow-sm"><Filter className="w-4 h-4" /> تصفية</button>
//           <button className="px-4 py-2 bg-primary text-white rounded-full flex items-center gap-2"><Download className="w-4 h-4" /> تصدير</button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {stats.map((s, i) => (
//           <div key={i} className="bg-white rounded-3xl p-6 border shadow-sm">
//             <p className="text-sm text-muted-foreground">{s.label}</p>
//             <p className="text-2xl font-bold">{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* الرسوم البيانية هنا بنفس منطق الجزء الأول */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//          {/* يمكنك وضع الـ BarChart و AreaChart هنا كما في الملف الأساسي */}
//       </div>
//     </motion.div>
//   );
// }