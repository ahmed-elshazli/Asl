// // src/doctorDashBoard/components/sections/OverviewSection.tsx
// import { motion } from 'motion/react';
// import { Apple, Plus, Crown } from 'lucide-react';
// import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
// import { stats, monthlyData, goalDistribution, recentPatients, messages } from '../../../data/doctorDashboardData';

// interface OverviewSectionProps {
//   setShowAssignPlanModal: (show: boolean) => void;
//   setShowAddPatientModal: (show: boolean) => void;
// }

// export function OverviewSection({ setShowAssignPlanModal, setShowAddPatientModal }: OverviewSectionProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-8"
//     >
//       <div>
//         <h1 className="text-2xl md:text-4xl font-bold mb-2">لوحة التحكم</h1>
//         <p className="text-muted-foreground text-base md:text-lg">مرحباً د. الاء، إليك ملخص اليوم</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.05 }}
//               whileHover={{ y: -5 }}
//               className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl`}>
//                   <Icon className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
//                   {stat.trend}
//                 </div>
//               </div>
//               <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
//               <p className="text-3xl font-bold">{stat.value}</p>
//             </motion.div>
//           );
//         })}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
//           <h2 className="text-2xl font-bold mb-6">نمو المرضى والإيرادات</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={monthlyData}>
//               <XAxis key="x-axis" dataKey="month" stroke="#6B7280" />
//               <YAxis key="y-axis" stroke="#6B7280" />
//               <Tooltip
//                 key="tooltip"
//                 contentStyle={{
//                   backgroundColor: '#FFFFFF',
//                   border: '1px solid #009E2A20',
//                   borderRadius: '1rem',
//                 }}
//               />
//               <Line
//                 key="patients-line"
//                 type="monotone"
//                 dataKey="patients"
//                 stroke="#009E2A"
//                 strokeWidth={3}
//                 dot={{ fill: '#009E2A', r: 5 }}
//                 name="المرضى"
//               />
//               <Line
//                 key="revenue-line"
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#00C236"
//                 strokeWidth={3}
//                 dot={{ fill: '#00C236', r: 5 }}
//                 name="الإيرادات"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border border-primary/10">
//           <h2 className="text-2xl font-bold mb-6">توزيع الأهداف</h2>
//           <ResponsiveContainer width="100%" height={200}>
//             <PieChart>
//               <Pie
//                 key="goals-pie"
//                 data={goalDistribution}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={90}
//                 paddingAngle={5}
//                 dataKey="value"
//               >
//                 {goalDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="space-y-2 mt-4">
//             {goalDistribution.map((goal) => (
//               <div key={goal.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: goal.color }}
//                   />
//                   <span className="text-sm">{goal.name}</span>
//                 </div>
//                 <span className="font-bold">{goal.value}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold">المرضى الحديثون</h2>
//             <div className="flex gap-2">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowAssignPlanModal(true)}
//                 className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-full text-sm font-semibold flex items-center gap-2"
//               >
//                 <Apple className="w-4 h-4" />
//                 <span className="hidden md:inline">تعيين خطة</span>
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowAddPatientModal(true)}
//                 className="px-4 py-2 bg-gradient-to-br from-primary to-accent text-white rounded-full text-sm font-semibold flex items-center gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>إضافة مريض</span>
//               </motion.button>
//             </div>
//           </div>
//           <div className="space-y-3 w-full">
//             {recentPatients.slice(0, 5).map((patient, idx) => (
//               <motion.div
//                 key={patient.name}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 + idx * 0.05 }}
//                 whileHover={{ scale: 1.02, x: -5 }}
//                 className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all w-full"
//               >
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
//                   {patient.name.charAt(0)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     <h4 className="font-bold truncate">{patient.name}</h4>
//                     {patient.status === 'premium' && (
//                       <Crown className="w-4 h-4 text-accent flex-shrink-0" />
//                     )}
//                   </div>
//                   <p className="text-sm text-muted-foreground truncate">{patient.goal}</p>
//                   <div className="mt-2 bg-secondary rounded-full h-1.5 overflow-hidden w-full">
//                     <div
//                       className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
//                       style={{ width: `${patient.progress}%` }}
//                     />
//                   </div>
//                 </div>
//                 <div className="text-left flex-shrink-0">
//                   <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold">الرسائل الحديثة</h2>
//             <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
//               {messages.filter((m) => m.unread).length}
//             </div>
//           </div>
//           <div className="space-y-3">
//             {messages.map((msg, idx) => (
//               <motion.div
//                 key={msg.patient}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 + idx * 0.05 }}
//                 whileHover={{ scale: 1.02, x: -5 }}
//                 className={`p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all ${
//                   msg.unread ? 'bg-primary/5' : ''
//                 }`}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <h4 className="font-bold">{msg.patient}</h4>
//                   <span className="text-xs text-muted-foreground">{msg.time}</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground">{msg.message}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }