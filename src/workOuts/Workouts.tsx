import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Heart, Zap, Crown, Lock, Play, Clock, Flame, Target, TrendingUp, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface WorkoutsProps {
  onPremiumAction: (action: () => void) => void;
  isPremium: boolean;
}

export default function Workouts({ onPremiumAction, isPremium }: WorkoutsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);

  const categories = [
    { id: 'all', label: 'الكل', icon: Zap },
    { id: 'cardio', label: 'كارديو', icon: Heart },
    { id: 'strength', label: 'حديد', icon: Dumbbell },
  ];

  const workoutPrograms = [
    {
      id: 1,
      name: 'برنامج حرق الدهون',
      category: 'cardio',
      level: 'مبتدئ',
      duration: '30 دقيقة',
      calories: '300-400',
      premium: false,
      exercises: [
        { name: 'الجري في المكان', duration: '5 دقائق', reps: '-' },
        { name: 'قفز الحبل', duration: '3 دقائق', reps: '-' },
        { name: 'Burpees', duration: '2 دقيقة', reps: '15-20' },
        { name: 'High Knees', duration: '3 دقائق', reps: '-' },
        { name: 'Mountain Climbers', duration: '2 دقيقة', reps: '20-30' },
        { name: 'استراحة', duration: '2 دقيقة', reps: '-' },
      ],
      description: 'برنامج كارديو مكثف لحرق السعرات الحرارية وتحسين اللياقة القلبية',
    },
    {
      id: 2,
      name: 'كارديو متقدم HIIT',
      category: 'cardio',
      level: 'متقدم',
      duration: '45 دقيقة',
      calories: '500-650',
      premium: true,
      exercises: [
        { name: 'إحماء خفيف', duration: '5 دقائق', reps: '-' },
        { name: 'Sprint Intervals', duration: '20 ثانية × 8', reps: '-' },
        { name: 'Jump Squats', duration: '1 دقيقة', reps: '15-20' },
        { name: 'Box Jumps', duration: '1 دقيقة', reps: '10-15' },
        { name: 'Burpees متقدم', duration: '2 دقيقة', reps: '20-25' },
        { name: 'تهدئة', duration: '5 دقائق', reps: '-' },
      ],
      description: 'برنامج HIIT متقدم لحرق دهون أسرع وتحسين الأداء الرياضي',
    },
    {
      id: 3,
      name: 'الجري للمسافات الطويلة',
      category: 'cardio',
      level: 'متوسط',
      duration: '60 دقيقة',
      calories: '600-800',
      premium: false,
      exercises: [
        { name: 'إحماء المشي', duration: '5 دقائق', reps: '-' },
        { name: 'جري خفيف', duration: '10 دقائق', reps: '-' },
        { name: 'جري متوسط السرعة', duration: '30 دقيقة', reps: '-' },
        { name: 'جري سريع', duration: '10 دقائق', reps: '-' },
        { name: 'تهدئة مشي', duration: '5 دقائق', reps: '-' },
      ],
      description: 'برنامج الجري لتحسين التحمل القلبي وحرق السعرات',
    },
    {
      id: 4,
      name: 'بناء العضلات للمبتدئين',
      category: 'strength',
      level: 'مبتدئ',
      duration: '45 دقيقة',
      calories: '250-350',
      premium: false,
      exercises: [
        { name: 'Bench Press', duration: '4 مجموعات', reps: '8-12' },
        { name: 'Squats', duration: '4 مجموعات', reps: '10-15' },
        { name: 'Pull-ups', duration: '3 مجموعات', reps: '5-10' },
        { name: 'Shoulder Press', duration: '3 مجموعات', reps: '8-12' },
        { name: 'Bicep Curls', duration: '3 مجموعات', reps: '10-15' },
        { name: 'Planks', duration: '3 مجموعات', reps: '30-60 ثانية' },
      ],
      description: 'برنامج تمارين حديد شامل للمبتدئين لبناء العضلات',
    },
    {
      id: 5,
      name: 'تضخيم العضلات المتقدم',
      category: 'strength',
      level: 'متقدم',
      duration: '90 دقيقة',
      calories: '400-550',
      premium: true,
      exercises: [
        { name: 'Deadlifts', duration: '5 مجموعات', reps: '5-8' },
        { name: 'Bench Press ثقيل', duration: '5 مجموعات', reps: '5-8' },
        { name: 'Squats ثقيل', duration: '5 مجموعات', reps: '5-8' },
        { name: 'Overhead Press', duration: '4 مجموعات', reps: '6-10' },
        { name: 'Barbell Rows', duration: '4 مجموعات', reps: '8-12' },
        { name: 'Weighted Dips', duration: '3 مجموعات', reps: '8-12' },
      ],
      description: 'برنامج تضخيم متقدم للرياضيين المحترفين',
    },
    {
      id: 6,
      name: 'تمارين القوة الوظيفية',
      category: 'strength',
      level: 'متوسط',
      duration: '60 دقيقة',
      calories: '300-400',
      premium: true,
      exercises: [
        { name: 'Kettlebell Swings', duration: '4 مجموعات', reps: '15-20' },
        { name: 'Clean and Press', duration: '4 مجموعات', reps: '8-10' },
        { name: 'Turkish Get-ups', duration: '3 مجموعات', reps: '5 كل جانب' },
        { name: 'Farmer Walks', duration: '4 مجموعات', reps: '30 متر' },
        { name: 'Battle Ropes', duration: '3 مجموعات', reps: '30 ثانية' },
      ],
      description: 'تمارين وظيفية لتحسين القوة والتوازن والتناسق',
    },
    {
      id: 7,
      name: 'Upper Body Push',
      category: 'strength',
      level: 'متوسط',
      duration: '60 دقيقة',
      calories: '280-380',
      premium: false,
      exercises: [
        { name: 'Flat Bench Press', duration: '4 مجموعات', reps: '8-12' },
        { name: 'Incline Dumbbell Press', duration: '4 مجموعات', reps: '10-12' },
        { name: 'Shoulder Press', duration: '4 مجموعات', reps: '8-12' },
        { name: 'Tricep Dips', duration: '3 مجموعات', reps: '10-15' },
        { name: 'Lateral Raises', duration: '3 مجموعات', reps: '12-15' },
        { name: 'Overhead Tricep Extension', duration: '3 مجموعات', reps: '10-12' },
      ],
      description: 'تمارين الجزء العلوي - تركيز على الدفع',
    },
    {
      id: 8,
      name: 'Lower Body Blast',
      category: 'strength',
      level: 'متقدم',
      duration: '75 دقيقة',
      calories: '350-480',
      premium: true,
      exercises: [
        { name: 'Back Squats', duration: '5 مجموعات', reps: '6-10' },
        { name: 'Romanian Deadlifts', duration: '4 مجموعات', reps: '8-12' },
        { name: 'Leg Press', duration: '4 مجموعات', reps: '10-15' },
        { name: 'Walking Lunges', duration: '3 مجموعات', reps: '12 كل رجل' },
        { name: 'Leg Curls', duration: '3 مجموعات', reps: '12-15' },
        { name: 'Calf Raises', duration: '4 مجموعات', reps: '15-20' },
      ],
      description: 'برنامج شامل للجزء السفلي - بناء قوة وحجم الأرجل',
    },
  ];

  const filteredWorkouts = activeCategory === 'all'
    ? workoutPrograms
    : workoutPrograms.filter(w => w.category === activeCategory);

  const stats = [
    { label: 'برامج تدريبية', value: workoutPrograms.length.toString(), icon: Dumbbell },
    { label: 'كارديو', value: workoutPrograms.filter(w => w.category === 'cardio').length.toString(), icon: Heart },
    { label: 'حديد', value: workoutPrograms.filter(w => w.category === 'strength').length.toString(), icon: Zap },
  ];

  return (
    <div className="p-6 md:p-8 pb-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            التمارين الرياضية
          </h1>
          <p className="text-muted-foreground text-lg">برامج تدريبية متكاملة لجميع المستويات</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg text-center"
            >
              <div className="inline-flex p-3 bg-primary rounded-2xl mb-3">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg"
      >
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout, idx) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => {
              if (workout.premium && !isPremium) {
                onPremiumAction(() => {});
              } else {
                setSelectedWorkout(workout);
                setShowWorkoutDetails(true);
              }
            }}
            className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg cursor-pointer relative overflow-hidden"
          >
            {workout.premium && !isPremium && (
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-br from-primary to-accent text-white rounded-full text-xs font-bold">
                  <Crown className="w-3 h-3" />
                  <span>مميز</span>
                </div>
              </div>
            )}

            <div className={workout.premium && !isPremium ? 'blur-[2px]' : ''}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary rounded-2xl">
                  {workout.category === 'cardio' ? (
                    <Heart className="w-6 h-6 text-white" />
                  ) : (
                    <Dumbbell className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{workout.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      workout.level === 'مبتدئ' ? 'bg-green-100 text-green-700' :
                      workout.level === 'متوسط' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {workout.level}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{workout.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">المدة:</span>
                  <span className="font-semibold">{workout.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">السعرات:</span>
                  <span className="font-semibold">{workout.calories}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">التمارين:</span>
                  <span className="font-semibold">{workout.exercises.length} تمرين</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-3 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                {workout.premium && !isPremium ? (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>مميز</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>ابدأ التمرين</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showWorkoutDetails && selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed  inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWorkoutDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowWorkoutDetails(false)}
                className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <div className="text-center mb-8 ">
                <div className="inline-flex p-6 bg-primary rounded-full mb-4">
                  {selectedWorkout.category === 'cardio' ? (
                    <Heart className="w-12 h-12 text-white" />
                  ) : (
                    <Dumbbell className="w-12 h-12 text-white" />
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">{selectedWorkout.name}</h2>
                <p className="text-muted-foreground text-lg">{selectedWorkout.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-primary/10 p-4 rounded-2xl text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">المدة</p>
                  <p className="font-bold">{selectedWorkout.duration}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-2xl text-center">
                  <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">السعرات</p>
                  <p className="font-bold">{selectedWorkout.calories}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-2xl text-center">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">المستوى</p>
                  <p className="font-bold">{selectedWorkout.level}</p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-3xl p-6 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <span>التمارين</span>
                </h3>
                <div className="space-y-4">
                  {selectedWorkout.exercises.map((exercise: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{exercise.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{exercise.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{exercise.reps}</span>
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="w-6 h-6 text-gray-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6" />
                <span>ابدأ التمرين الآن</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
