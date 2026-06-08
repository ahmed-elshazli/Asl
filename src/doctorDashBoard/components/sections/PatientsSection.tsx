// // src/doctorDashBoard/components/sections/PatientsSection.tsx
// import { motion } from 'motion/react';
// import { Plus, Search, Calendar, ChevronRight, Crown } from 'lucide-react';
// import { recentPatients } from '../../../data/doctorDashboardData';

// interface PatientsSectionProps {
//   setShowAddPatientModal: (show: boolean) => void;
//   setSelectedPatient: (patient: any) => void;
//   setShowPatientDetails: (show: boolean) => void;
// }

// export function PatientsSection({ setShowAddPatientModal, setSelectedPatient, setShowPatientDetails }: PatientsSectionProps) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-4xl font-bold mb-2">إدارة المرضى</h1>
//           <p className="text-muted-foreground text-base md:text-lg">جميع المرضى المسجلين</p>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//           onClick={() => setShowAddPatientModal(true)}
//           className="px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg"
//         >
//           <Plus className="w-5 h-5" />
//           <span className="hidden sm:inline">إضافة مريض جديد</span>
//           <span className="sm:hidden">إضافة مريض</span>
//         </motion.button>
//       </div>

//       <div className="bg-white rounded-3xl p-4 md:p-6 border border-primary/10 shadow-lg w-full">
//         <div className="relative mb-6">
//           <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//           <input type="text" placeholder="ابحث عن مريض..." className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary" />
//         </div>

//         <div className="space-y-3 w-full">
//           {recentPatients.map((patient, idx) => (
//             <motion.div
//               key={patient.name}
//               onClick={() => { setSelectedPatient(patient); setShowPatientDetails(true); }}
//               className="flex items-center gap-3 p-4 bg-white rounded-2xl hover:bg-secondary cursor-pointer transition-all border border-primary/5 shadow-sm w-full"
//             >
//               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
//                 {patient.name.charAt(0)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h3 className="font-bold truncate text-sm md:text-base">{patient.name}</h3>
//                   {patient.status === 'premium' && <Crown className="w-3 h-3 text-accent flex-shrink-0" />}
//                 </div>
//                 <p className="text-xs text-muted-foreground truncate">{patient.goal}</p>
//               </div>
//               <div className="relative w-10 h-10 flex-shrink-0">
//                 <svg className="w-full h-full -rotate-90">
//                   <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#E8F5ED" strokeWidth="4" />
//                   <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#009E2A" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 35}`} strokeDashoffset={`${2 * Math.PI * 35 * (1 - patient.progress / 100)}`} strokeLinecap="round" />
//                 </svg>
//                 <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{patient.progress}%</span>
//               </div>
//               <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }