// // src/doctorDashBoard/components/sections/MessagesSection.tsx
// import { motion } from 'motion/react';
// import { MessageCircle, Search, Send } from 'lucide-react';
// import { recentPatients, messages } from '../../../data/doctorDashboardData';

// interface MessagesSectionProps {
//   selectedConversation: any;
//   setSelectedConversation: (conv: any) => void;
//   messageText: string;
//   setMessageText: (text: string) => void;
// }

// export function MessagesSection({ selectedConversation, setSelectedConversation, messageText, setMessageText }: MessagesSectionProps) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//       <h1 className="text-2xl md:text-4xl font-bold mb-2">الرسائل</h1>
//       <p className="text-muted-foreground text-base md:text-lg mb-8">تواصل مع مرضاك</p>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1 space-y-4">
//           <div className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg">
//             <div className="relative mb-4"><Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="text" placeholder="ابحث..." className="w-full pr-12 pl-6 py-3 bg-secondary rounded-2xl border-none" /></div>
//             <div className="space-y-2">
//               {recentPatients.filter(p => p.status === 'premium').map((p) => (
//                 <div key={p.name} onClick={() => setSelectedConversation(p)} className={`p-4 rounded-2xl cursor-pointer ${selectedConversation?.name === p.name ? 'bg-gradient-to-br from-primary to-accent text-white' : 'hover:bg-secondary'}`}>
//                   {p.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="lg:col-span-2 bg-white rounded-3xl border border-primary/10 shadow-lg overflow-hidden flex flex-col" style={{ height: '700px' }}>
//           {selectedConversation ? (
//             <>
//               <div className="bg-gradient-to-br from-primary to-accent p-6 text-white">{selectedConversation.name}</div>
//               <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
//                 {/* هنا ضع رسائل المحادثة */}
//               </div>
//               <div className="p-6 border-t flex gap-3">
//                 <input value={messageText} onChange={(e) => setMessageText(e.target.value)} className="flex-1 px-6 py-4 bg-secondary rounded-full" />
//                 <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white"><Send /></button>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-muted-foreground"><MessageCircle className="w-20 h-20" /></div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }