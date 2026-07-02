import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Target, Clock, Flame, Loader2, Play, CheckCircle, Activity, CalendarDays, ChevronRight, ChevronLeft, Check, X, Maximize } from 'lucide-react';
import { useState } from 'react';
import { useMyTrainingPrograms, useCompleteExercise } from './hooks/useTrainingPrograms';

export default function Workouts() {
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  
  // Active Workout State
  const [activeMode, setActiveMode] = useState<'overview' | 'active'>('overview');
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const { data: userProgramsData, isLoading } = useMyTrainingPrograms();
  const { mutate: completeExercise, isPending: isCompleting } = useCompleteExercise();

  const mappedWorkouts = userProgramsData?.map((up: any) => {
    const prog = up.programId || up.program || up; // handle both programId or program keys
    if (!prog || typeof prog !== 'object') return null;

    let actualProgramId = prog._id || prog.id;
    if (up.programId && typeof up.programId === 'object') actualProgramId = up.programId._id || up.programId.id;
    else if (up.program && typeof up.program === 'object') actualProgramId = up.program._id || up.program.id;
    
    // إذا لم نتمكن من استخراج معرف البرنامج، نستخدم المعرف الأساسي كحل أخير
    if (!actualProgramId) actualProgramId = up.programId || up.program || up._id || up.id;

    let totalCalories = 0;
    let totalDuration = 0;

    const mappedExercises = prog.exercises?.map((ex: any) => {
      const fullExercise = (ex.exerciseId && typeof ex.exerciseId === 'object') ? ex.exerciseId : 
                           (ex.exercise && typeof ex.exercise === 'object') ? ex.exercise : ex;
                           
      let extractedId = fullExercise?._id || fullExercise?.id;
      if (!extractedId) {
        if (typeof ex === 'string') extractedId = ex;
        else if (typeof ex.exerciseId === 'string') extractedId = ex.exerciseId;
        else if (typeof ex.exercise === 'string') extractedId = ex.exercise;
        else if (ex.exerciseId?._id) extractedId = ex.exerciseId._id;
        else if (ex.exercise?._id) extractedId = ex.exercise._id;
        else extractedId = ex._id || ex.id;
      }

      const duration = fullExercise?.duration || 0;
      const cals = fullExercise?.calories || 0;
      
      totalDuration += duration;
      totalCalories += cals;

      return {
        id: extractedId,
        name: fullExercise?.title || fullExercise?.name || 'تمرين',
        description: fullExercise?.description,
        duration: duration ? `${duration} دقيقة` : '-',
        reps: ex.repsOrDuration || (fullExercise?.reps ? `${fullExercise.reps} تكرار` : (ex.sets ? `${ex.sets} مجموعات` : '-')),
        images: fullExercise?.images || [],
        calories: cals
      };
    }).filter((ex: any) => !!ex.id) || [];

    return {
      id: actualProgramId, // إرسال معرف البرنامج الأساسي بشكل قاطع
      assignmentId: up._id || up.id,
      name: prog.title || prog.name || 'برنامج تدريبي',
      category: prog.category || 'عام',
      level: prog.level === 'beginner' ? 'مبتدئ' : prog.level === 'intermediate' ? 'متوسط' : prog.level === 'advanced' ? 'متقدم' : prog.level || 'متوسط',
      duration: prog.duration ? `${prog.duration} ${prog.duration > 10 ? 'دقيقة' : 'أيام'}` : `${totalDuration} دقيقة`,
      calories: prog.maxCalories ? `${prog.minCalories || 0} - ${prog.maxCalories}` : `${totalCalories} كالوري`, 
      exercises: mappedExercises,
      description: prog.description || 'لا يوجد وصف',
      imageUrl: prog.imageUrl,
      videoUrl: prog.videoUrl,
      status: up.status || 'معين',
      startDate: up.startedAt || up.startDate ? new Date(up.startedAt || up.startDate).toLocaleDateString('ar-EG') : 'اليوم',
      endDate: up.endDate ? new Date(up.endDate).toLocaleDateString('ar-EG') : null,
      progress: up.progress || 0,
      totalExercises: up.totalExercises || mappedExercises.length,
      currentRound: up.currentRound || 0,
      durationInDays: up.durationInDays || 1,
      repeatCount: up.repeatCount || 1,
      completedExercises: up.completedExercises || []
    };
  }).filter(Boolean) || [];

  const handleStartWorkout = () => {
    let startIdx = 0;
    if (selectedWorkout && selectedWorkout.completedExercises) {
       const uncompletedIdx = selectedWorkout.exercises.findIndex(
         (ex: any) => !selectedWorkout.completedExercises.includes(ex.id)
       );
       if (uncompletedIdx !== -1) {
         startIdx = uncompletedIdx;
       }
    }
    setCurrentExIdx(startIdx);
    setCurrentImgIdx(0);
    setActiveMode('active');
  };

  const handleCompleteCurrentExercise = () => {
    if (!selectedWorkout) return;
    const currentEx = selectedWorkout.exercises[currentExIdx];
    
    completeExercise(
      { programId: selectedWorkout.assignmentId, exerciseId: currentEx.id },
      {
        onSuccess: () => {
          if (currentExIdx < selectedWorkout.exercises.length - 1) {
            setCurrentExIdx(prev => prev + 1);
            setCurrentImgIdx(0);
          } else {
            setShowWorkoutDetails(false);
            setActiveMode('overview');
          }
        }
      }
    );
  };

  const activeExercise = selectedWorkout?.exercises?.[currentExIdx];

  return (
    <div className="p-6 md:p-8 pb-12 space-y-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-3">
            برامجك التدريبية
          </h1>
          <p className="text-muted-foreground text-lg font-medium">البرامج المخصصة لك من قبل طبيبك لتحقيق أهدافك</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : mappedWorkouts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-primary/5 shadow-sm">
          <Dumbbell className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">لا توجد برامج تدريبية حالياً</h2>
          <p className="text-muted-foreground">تواصل مع طبيبك لتعيين برنامج مناسب لك لتبدأ رحلتك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedWorkouts.map((workout: any, idx: number) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                setSelectedWorkout(workout);
                setActiveMode('overview');
                setShowWorkoutDetails(true);
              }}
              className="bg-white rounded-[2.5rem] p-8 border border-primary/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-accent/5 rounded-bl-full transition-transform duration-500 group-hover:scale-110" />

              <div className="flex items-center gap-5 mb-8 relative">
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold line-clamp-1 mb-1 text-foreground">{workout.name}</h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Target className="w-4 h-4 text-primary" />
                    {workout.level}
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-secondary/40 rounded-2xl p-5">
                <div className="flex justify-between text-sm mb-3 font-bold">
                  <span className="text-muted-foreground">التقدم العام</span>
                  <span className="text-primary">{Math.round(workout.progress)}%</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${workout.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-secondary/30 rounded-2xl p-4 text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2 opacity-80" />
                  <p className="font-black text-sm">{workout.duration}</p>
                </div>
                <div className="bg-secondary/30 rounded-2xl p-4 text-center">
                  <Flame className="w-6 h-6 text-accent mx-auto mb-2 opacity-80" />
                  <p className="font-black text-sm">{workout.calories}</p>
                </div>
                <div className="bg-secondary/30 rounded-2xl p-4 text-center">
                  <Activity className="w-6 h-6 text-[#EAB308] mx-auto mb-2 opacity-80" />
                  <p className="font-black text-sm">{workout.totalExercises} تمرين</p>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/5 flex justify-between items-center relative">
                <span className="font-bold text-primary">استعراض البرنامج</span>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <ChevronLeft className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* تفاصيل البرنامج أو التمرين النشط */}
      <AnimatePresence>
        {showWorkoutDetails && selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md"
            onClick={() => setShowWorkoutDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`bg-secondary/30 rounded-[2.5rem] w-full max-w-4xl flex flex-col relative overflow-hidden shadow-2xl ${activeMode === 'active' ? 'h-[90vh]' : 'max-h-[90vh]'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {activeMode === 'overview' ? (
                <div className="flex flex-col h-full bg-white overflow-hidden min-h-0">
                  {/* Overview Header */}
                  <div className="p-8 md:p-10 bg-gradient-to-br from-primary/5 to-accent/5 relative">
                    <button
                      onClick={() => setShowWorkoutDetails(false)}
                      className="absolute top-6 left-6 w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-md flex items-center justify-center flex-shrink-0 text-primary">
                        <Target className="w-10 h-10" />
                      </div>
                      <div className="pl-12">
                        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">{selectedWorkout.name}</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">{selectedWorkout.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-sm text-sm font-bold text-foreground">
                        <Target className="w-4 h-4 text-primary" /> {selectedWorkout.level}
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-sm text-sm font-bold text-foreground">
                        <CalendarDays className="w-4 h-4 text-primary" /> البداية: {selectedWorkout.startDate}
                      </div>
                      {selectedWorkout.endDate && (
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-sm text-sm font-bold text-muted-foreground border border-secondary">
                          <CalendarDays className="w-4 h-4" /> النهاية: {selectedWorkout.endDate}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 rounded-xl text-sm font-bold text-primary">
                        التكرار: {selectedWorkout.repeatCount} مرات
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 rounded-xl text-sm font-bold text-primary">
                        مدة البرنامج: {selectedWorkout.durationInDays} يوم
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 rounded-xl text-sm font-bold text-primary">
                        الجولة الحالية: {selectedWorkout.currentRound}
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 rounded-xl text-sm font-bold text-primary">
                        الحالة: {selectedWorkout.status === 'active' ? 'نشط' : selectedWorkout.status}
                      </div>
                    </div>
                  </div>

                  {/* Overview Content */}
                  <div className="flex-1 overflow-y-auto p-8 md:p-10 [scrollbar-width:none]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black flex items-center gap-3">
                        <Activity className="w-7 h-7 text-primary" />
                        جدول التمارين ({selectedWorkout.exercises?.length || 0})
                      </h3>
                      <div className="text-sm font-bold text-muted-foreground bg-secondary/50 px-4 py-2 rounded-xl">
                        مكتمل: {selectedWorkout.completedExercises?.length || 0}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedWorkout.exercises?.map((ex: any, i: number) => {
                        const isCompleted = selectedWorkout.completedExercises?.includes(ex.id);
                        return (
                          <div key={i} className={`flex flex-col sm:flex-row items-center p-4 rounded-[1.5rem] transition-all group ${isCompleted ? 'bg-primary/5 border border-primary/20' : 'bg-white border border-secondary shadow-sm hover:border-primary/30 hover:shadow-md'}`}>
                            
                            <div className="flex items-center gap-5 w-full sm:w-auto flex-1">
                              {ex.images?.[0] ? (
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-[1.25rem] overflow-hidden bg-secondary/20">
                                  <img src={ex.images[0]} alt={ex.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                                  {isCompleted && (
                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                                      <CheckCircle className="w-8 h-8 text-white shadow-sm" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className={`w-20 h-20 rounded-[1.25rem] flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-inner ${isCompleted ? 'bg-primary text-white' : 'bg-secondary/50 text-muted-foreground'}`}>
                                  {isCompleted ? <CheckCircle className="w-8 h-8" /> : i + 1}
                                </div>
                              )}
                              <div>
                                <span className={`font-black text-lg block mb-1 ${isCompleted ? 'text-primary' : 'text-foreground'}`}>{ex.name}</span>
                                {ex.description && <p className="text-sm text-muted-foreground line-clamp-1">{ex.description}</p>}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="text-center px-4">
                                <p className="text-xs text-muted-foreground font-bold mb-1">المطلوب</p>
                                <p className="font-black text-primary text-lg">{ex.reps !== '-' ? ex.reps : ex.duration}</p>
                              </div>
                              {ex.calories > 0 && (
                                <div className="text-center px-4 border-r border-secondary">
                                  <p className="text-xs text-muted-foreground font-bold mb-1">السعرات</p>
                                  <p className="font-black text-accent text-lg">{ex.calories}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {(!selectedWorkout.exercises || selectedWorkout.exercises.length === 0) && (
                        <div className="text-center py-16 bg-secondary/20 rounded-[2rem] border-2 border-dashed border-secondary">
                          <Activity className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                          <p className="text-muted-foreground font-semibold">لا توجد تمارين مدرجة في هذا البرنامج</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overview Footer */}
                  <div className="p-6 md:p-8 border-t border-primary/5 bg-white flex flex-col-reverse sm:flex-row justify-end gap-4 shadow-[0_-10px_40px_rgb(0,0,0,0.02)]">
                    <button
                      onClick={() => setShowWorkoutDetails(false)}
                      className="px-8 py-4 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-colors w-full sm:w-auto"
                    >
                      العودة
                    </button>
                    {selectedWorkout.exercises?.length > 0 && (
                      <button 
                        onClick={handleStartWorkout}
                        className="px-10 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(15,110,86,0.2)] hover:shadow-[0_8px_30px_rgb(15,110,86,0.4)] hover:-translate-y-1 transition-all w-full sm:w-auto"
                      >
                        <Play className="w-6 h-6 fill-white" />
                        بدء التمرين
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Active Workout UI */}
                  {activeExercise && (
                    <div className="flex flex-col h-full bg-secondary/10 overflow-hidden min-h-0">
                      {/* Active Header */}
                      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-primary/5 shadow-sm z-10">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground font-bold mb-0.5">التمرين الحالي</span>
                          <div className="text-primary font-black text-lg">
                            {currentExIdx + 1} <span className="text-muted-foreground font-bold text-sm">من {selectedWorkout.exercises.length}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveMode('overview')}
                          className="px-5 py-2.5 bg-secondary/50 text-sm font-bold rounded-xl hover:bg-secondary transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          إغلاق
                        </button>
                      </div>

                      {/* Active Content */}
                      <div className="flex-1 overflow-y-auto p-6 md:p-10 [scrollbar-width:none] flex flex-col items-center">
                        
                        {/* Image Gallery */}
                        <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-sm border border-primary/5 h-60 sm:h-72 md:h-96 mb-8 relative flex items-center justify-center overflow-hidden group">
                          {activeExercise.images && activeExercise.images.length > 0 ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setFullScreenImage(activeExercise.images[currentImgIdx]); }}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-primary hover:scale-110 transition-transform z-10"
                              >
                                <Maximize className="w-5 h-5" />
                              </button>
                              <img 
                                src={activeExercise.images[currentImgIdx]} 
                                alt={activeExercise.name} 
                                className="w-full h-full object-contain p-2 md:p-6 cursor-pointer"
                                onClick={() => setFullScreenImage(activeExercise.images[currentImgIdx])}
                              />
                              
                              {/* Next/Prev Buttons for images */}
                              {activeExercise.images.length > 1 && (
                                <>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentImgIdx((prev) => (prev > 0 ? prev - 1 : activeExercise.images.length - 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-lg border border-primary/5 rounded-full flex items-center justify-center text-primary hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                  >
                                    <ChevronRight className="w-6 h-6" />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentImgIdx((prev) => (prev < activeExercise.images.length - 1 ? prev + 1 : 0)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-lg border border-primary/5 rounded-full flex items-center justify-center text-primary hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                  >
                                    <ChevronLeft className="w-6 h-6" />
                                  </button>
                                  
                                  {/* Dots */}
                                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full backdrop-blur shadow-sm">
                                    {activeExercise.images.map((_: any, idx: number) => (
                                      <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentImgIdx ? 'w-6 bg-primary' : 'w-2 bg-primary/30'}`} />
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="text-muted-foreground flex flex-col items-center">
                              <Dumbbell className="w-20 h-20 mb-4 opacity-20" />
                              <p className="font-bold">لا توجد صور لهذا التمرين</p>
                            </div>
                          )}
                        </div>

                        {/* Exercise Info */}
                        <div className="text-center mb-10 w-full max-w-2xl">
                          <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">{activeExercise.name}</h2>
                          {activeExercise.description && (
                            <p className="text-muted-foreground text-lg leading-relaxed bg-white p-6 rounded-3xl shadow-sm border border-primary/5">
                              {activeExercise.description}
                            </p>
                          )}
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-xl">
                          <div className="flex-1 min-w-[140px] bg-white rounded-[2rem] p-6 text-center shadow-sm border border-primary/5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                              <Target className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground font-bold mb-1">المطلوب</p>
                            <p className="font-black text-2xl text-primary">{activeExercise.reps !== '-' ? activeExercise.reps : activeExercise.duration}</p>
                          </div>
                          {activeExercise.calories > 0 && (
                            <div className="flex-1 min-w-[140px] bg-white rounded-[2rem] p-6 text-center shadow-sm border border-primary/5">
                              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                                <Flame className="w-6 h-6 text-accent" />
                              </div>
                              <p className="text-sm text-muted-foreground font-bold mb-1">السعرات</p>
                              <p className="font-black text-2xl text-accent">{activeExercise.calories} سعر</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Active Footer */}
                      <div className="p-6 md:px-10 md:py-6 border-t border-primary/5 bg-white shadow-[0_-10px_40px_rgb(0,0,0,0.02)] z-10">
                        <button
                          onClick={handleCompleteCurrentExercise}
                          disabled={isCompleting}
                          className="w-full max-w-xl mx-auto py-5 bg-gradient-to-br from-primary to-accent text-white rounded-[2rem] font-bold text-xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(15,110,86,0.3)] hover:shadow-[0_8px_30px_rgb(15,110,86,0.5)] hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >
                          {isCompleting ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin" />
                              جاري تسجيل الإنجاز...
                            </>
                          ) : (
                            <>
                              <Check className="w-7 h-7" />
                              إكمال التمرين والانتقال
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setFullScreenImage(null)}
          >
            <button 
              onClick={() => setFullScreenImage(null)}
              className="absolute top-6 left-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={fullScreenImage} 
              alt="Full screen" 
              className="w-full h-full object-contain cursor-zoom-out" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
