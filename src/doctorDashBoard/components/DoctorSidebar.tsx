// // src/doctorDashBoard/components/DoctorSidebar.tsx
// import { motion } from 'motion/react';
// import { Activity, Users, MessageCircle, Apple, TrendingUp, LogOut, X } from 'lucide-react';

// interface DoctorSidebarProps {
//   activeSection: string;
//   setActiveSection: (section: string) => void;
//   isSidebarOpen: boolean;
//   setIsSidebarOpen: (isOpen: boolean) => void;
//   onLogout: () => void;
// }

// export function DoctorSidebar({ activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen, onLogout }: DoctorSidebarProps) {
//   return (
//     <aside
//       className={`
//         w-72 bg-white border-l border-primary/10 min-h-screen p-6
//         lg:block lg:sticky lg:top-0 fixed top-0 right-0 z-50 lg:z-auto
//         ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0
//         transition-transform duration-300 ease-in-out lg:transition-none
//       `}
//     >
//       <motion.button
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsSidebarOpen(false)}
//         className="lg:hidden absolute top-4 left-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
//       >
//         <X className="w-5 h-5 text-muted-foreground" />
//       </motion.button>

//       <div className="mb-12">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">د.س</div>
//           <div>
//             <h3 className="font-bold">د. الاء سعد</h3>
//             <p className="text-sm text-muted-foreground">أخصائية تغذية</p>
//           </div>
//         </div>
//       </div>

//       <nav className="space-y-2">
//         {[
//           { id: 'overview', label: 'لوحة التحكم', icon: Activity },
//           { id: 'patients', label: 'المرضى', icon: Users },
//           { id: 'messages', label: 'الرسائل', icon: MessageCircle },
//           { id: 'plans', label: 'الخطط الغذائية', icon: Apple },
//           { id: 'analytics', label: 'الإحصائيات', icon: TrendingUp },
//         ].map((item) => {
//           const Icon = item.icon;
//           const isActive = activeSection === item.id;
//           return (
//             <motion.button
//               key={item.id}
//               whileHover={{ scale: 1.02, x: -5 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
//                 isActive ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span className="font-semibold">{item.label}</span>
//             </motion.button>
//           );
//         })}
//       </nav>

//       <div className="mt-auto pt-12">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
//         >
//           <LogOut className="w-5 h-5" />
//           <span className="font-semibold">تسجيل الخروج</span>
//         </motion.button>
//       </div>
//     </aside>
//   );
// }