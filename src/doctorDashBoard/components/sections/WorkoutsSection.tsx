import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Plus, Trash2, Edit, Loader2, Zap, Users } from 'lucide-react';
import { useState } from 'react';
import { useExercises, useDeleteExercise } from '../../../workOuts/hooks/useExercises';
import { useTrainingPrograms, useDeleteTrainingProgram } from '../../../workOuts/hooks/useTrainingPrograms';
import { ConfirmDeleteModal } from '../../modals/ConfirmDeleteModal';

const levelMap: Record<string, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم'
};

const categoryMap: Record<string, string> = {
  strength: 'قوة',
  cardio: 'كارديو',
  flexibility: 'مرونة',
  rehabilitation: 'تأهيل'
};

interface WorkoutsSectionProps {
  onShowAddExercise: () => void;
  onEditExercise: (id: string) => void;
  onShowAddProgram: () => void;
  onEditProgram: (id: string) => void;
  onShowProgramUsers?: (id: string, title: string) => void;
}

export function WorkoutsSection({
  onShowAddExercise,
  onEditExercise,
  onShowAddProgram,
  onEditProgram,
  onShowProgramUsers
}: WorkoutsSectionProps) {
  const [activeTab, setActiveTab] = useState<'exercises' | 'programs'>('exercises');

  // Delete State
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const { data: exercises, isLoading: loadingExercises } = useExercises();
  const { data: programs, isLoading: loadingPrograms } = useTrainingPrograms();

  const { mutate: deleteExercise, isPending: deletingExercise } = useDeleteExercise();
  const { mutate: deleteProgram, isPending: deletingProgram } = useDeleteTrainingProgram();

  const handleDeleteExercise = () => {
    if (exerciseToDelete) {
      deleteExercise(exerciseToDelete, {
        onSuccess: () => setExerciseToDelete(null)
      });
    }
  };

  const handleDeleteProgram = () => {
    if (programToDelete) {
      deleteProgram(programToDelete, {
        onSuccess: () => setProgramToDelete(null)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">التمارين والبرامج التدريبية</h2>
          <p className="text-muted-foreground">إدارة مكتبة التمارين وبرامج التدريب</p>
        </div>
        
        <div className="flex gap-2">
          {activeTab === 'exercises' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onShowAddExercise}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة تمرين</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onShowAddProgram}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة برنامج</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white border border-primary/10 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'exercises' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>التمارين</span>
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'programs' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>البرامج التدريبية</span>
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'exercises' ? (
            loadingExercises ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : !exercises || exercises.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-primary/10 shadow-lg">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">لا توجد تمارين</h3>
                <p className="text-muted-foreground">قم بإضافة تمارين رياضية للمكتبة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {exercises.map((exercise: any) => (
                  <div key={exercise._id} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg group hover:border-primary/30 transition-all relative">
                    <div className="flex flex-col mb-4">
                      {/* الأيقونة والأزرار في سطر */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded-2xl flex items-center justify-center text-primary overflow-hidden shadow-sm">
                          {exercise.images && exercise.images.length > 0 ? (
                            <img src={exercise.images[0]} alt={exercise.title || exercise.name} className="w-full h-full object-cover" />
                          ) : (
                            <Dumbbell className="w-8 h-8" />
                          )}
                        </div>
                        
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 flex-shrink-0">
                          <button onClick={() => onEditExercise(exercise._id)} className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setExerciseToDelete(exercise._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* العنوان في سطر كامل لوحده */}
                      <h3 className="font-bold text-lg break-words">{exercise.title || exercise.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-primary/5">
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs text-muted-foreground">المدة</p>
                        <p className="font-bold text-primary">{exercise.duration || '-'} دقيقة</p>
                      </div>
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs text-muted-foreground">حرق تقريبي</p>
                        <p className="font-bold text-primary">{exercise.calories || '-'} كالوري</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            loadingPrograms ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : !programs || programs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-primary/10 shadow-lg">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">لا توجد برامج تدريبية</h3>
                <p className="text-muted-foreground">قم بإضافة برامج تدريبية متكاملة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {programs.map((program: any) => (
                  <div key={program._id} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg group hover:border-primary/30 transition-all relative">
                    <div className="flex flex-col mb-4">
                      {/* الأيقونة والأزرار في سطر */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                          <Zap className="w-8 h-8" />
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => onShowProgramUsers?.(program._id, program.title)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="المشتركون في البرنامج">
                            <Users className="w-4 h-4" />
                          </button>
                          <button onClick={() => onEditProgram(program._id)} className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all" title="تعديل">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setProgramToDelete(program._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* العنوان في سطر لوحده لضمان ظهوره بالكامل بالعرض */}
                      <h3 className="font-bold text-lg mb-3 break-words leading-tight">{program.title || program.name}</h3>
                      
                      {/* العلامات */}
                      <div className="flex flex-wrap gap-2">
                        {!program.isActive && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">غير مفعل</span>
                        )}
                        {program.isPremium && (
                          <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">Premium</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 bg-secondary text-primary font-bold rounded-full">
                          {levelMap[program.level?.toLowerCase() || ''] || program.level}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full">
                          {categoryMap[program.category?.toLowerCase() || ''] || program.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-primary/5">
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs text-muted-foreground">المدة</p>
                        <p className="font-bold text-primary">{program.duration || '-'} أسابيع</p>
                      </div>
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs text-muted-foreground">التمارين</p>
                        <p className="font-bold text-primary">{program.exercises?.length || 0}</p>
                      </div>
                      <div className="bg-secondary rounded-xl p-2 text-center">
                        <p className="text-xs text-muted-foreground">السعرات</p>
                        <p className="font-bold text-primary text-[10px] mt-1">
                          {program.minCalories || 0} - {program.maxCalories || 0}
                        </p>
                      </div>
                    </div>

                    {/* قائمة التمارين */}
                    {program.exercises && program.exercises.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-primary/5">
                        <p className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                          <Dumbbell className="w-4 h-4" />
                          <span>التمارين المشمولة:</span>
                        </p>
                        <div className="flex flex-col gap-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                          {program.exercises.map((ex: any, idx: number) => {
                            // أحياناً الـ API يرجع exerciseId كـ Object وأحياناً كـ String
                            // لو String، هندور عليه في مصفوفة التمارين اللي إحنا جايبينها من قبل (exercises)
                            let exerciseData = typeof ex.exerciseId === 'object' ? ex.exerciseId : null;
                            
                            if (!exerciseData && typeof ex.exerciseId === 'string') {
                              exerciseData = exercises?.find((e: any) => e._id === ex.exerciseId);
                            } else if (!exerciseData && typeof ex === 'string') {
                              // لربما الـ API يرجع المصفوفة كلها strings
                              exerciseData = exercises?.find((e: any) => e._id === ex);
                            }

                            if (!exerciseData) {
                              return (
                                <div key={idx} className="flex items-center gap-3 bg-secondary/30 p-2 rounded-xl border border-primary/5">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-primary/20" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground truncate">تمرين غير متوفر</p>
                                  </div>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={idx} className="flex items-center gap-3 bg-secondary/30 hover:bg-secondary/60 transition-colors p-2 rounded-xl border border-primary/5">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center shadow-sm">
                                  {exerciseData?.images?.[0] ? (
                                    <img src={exerciseData.images[0]} alt={exerciseData.title || exerciseData.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Dumbbell className="w-5 h-5 text-primary/40" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold truncate" title={exerciseData?.title || exerciseData?.name}>{exerciseData?.title || exerciseData?.name || 'تمرين بدون اسم'}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {exerciseData?.duration ? `${exerciseData.duration} دقيقة` : ''} 
                                    {exerciseData?.duration && exerciseData?.calories ? ' • ' : ''}
                                    {exerciseData?.calories ? `${exerciseData.calories} سعرة` : ''}
                                  </p>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                                  {ex.order || idx + 1}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* تلميح للمستخدم في حالة وجود سكرول */}
                        {program.exercises.length > 2 && (
                          <div className="flex justify-center mt-2">
                            <span className="text-[10px] text-primary/60 font-bold flex items-center gap-1 animate-pulse">
                              <span>اسحب لرؤية المزيد</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* تاريخ الإنشاء */}
                    {program.createdAt && (
                      <div className="mt-4 pt-3 border-t border-primary/5 text-left">
                        <p className="text-[10px] text-muted-foreground/70">
                          أضيف في: {new Date(program.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {exerciseToDelete && (
          <ConfirmDeleteModal
            isOpen={true}
            onClose={() => setExerciseToDelete(null)}
            onConfirm={handleDeleteExercise}
            isDeleting={deletingExercise}
            title="حذف التمرين"
            description="هل أنت متأكد من أنك تريد حذف هذا التمرين بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء."
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {programToDelete && (
          <ConfirmDeleteModal
            isOpen={true}
            onClose={() => setProgramToDelete(null)}
            onConfirm={handleDeleteProgram}
            isDeleting={deletingProgram}
            title="حذف البرنامج التدريبي"
            description="هل أنت متأكد من أنك تريد حذف هذا البرنامج بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء."
          />
        )}
      </AnimatePresence>
    </div>
  );
}
