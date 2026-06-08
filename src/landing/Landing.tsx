import { motion } from 'motion/react';
import { Apple, MessageCircle, TrendingUp, Crown, Sparkles, CheckCircle, Users, Award, Zap, Shield, Heart, Activity } from 'lucide-react';

interface LandingProps {
  onShowLogin: () => void;
  isAuthenticated: boolean;
  userName?: string;
}

export function Landing({ onShowLogin, isAuthenticated, userName }: LandingProps) {
  const features = [
    {
      icon: Apple,
      title: 'خطط غذائية مخصصة',
      description: 'احصل على نظام غذائي مصمم خصيصاً لأهدافك الصحية',
      color: '#009E2A',
    },
    {
      icon: MessageCircle,
      title: 'تواصل مباشر مع الطبيب',
      description: 'استشارات فورية ومتابعة مستمرة من أخصائي التغذية',
      color: '#00C236',
    },
    {
      icon: TrendingUp,
      title: 'تتبع التقدم',
      description: 'راقب وزنك وسعراتك وإنجازاتك بشكل تفاعلي',
      color: '#009E2A',
    },
    {
      icon: Sparkles,
      title: 'توصيات ذكية',
      description: 'نظام ذكي يقترح أفضل الخيارات لتحقيق أهدافك',
      color: '#00C236',
    },
    {
      icon: Award,
      title: 'نظام الإنجازات',
      description: 'احصل على أوسمة ومكافآت عند تحقيق أهدافك',
      color: '#009E2A',
    },
    {
      icon: Shield,
      title: 'خصوصية وأمان',
      description: 'بياناتك الصحية محمية بأعلى معايير الأمان',
      color: '#00C236',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'مستخدم نشط' },
    { value: '95%', label: 'معدل النجاح' },
    { value: '500+', label: 'خطة غذائية' },
    { value: '24/7', label: 'دعم متواصل' },
  ];

  const plans = [
    {
      name: 'إنقاص الوزن',
      description: 'خطط متوازنة لفقدان الوزن بشكل صحي وآمن',
      icon: TrendingUp,
      patients: '5,000+',
    },
    {
      name: 'زيادة الوزن',
      description: 'برامج غنية بالبروتين لبناء العضلات والكتلة',
      icon: Activity,
      patients: '2,500+',
    },
    {
      name: 'نمط حياة صحي',
      description: 'توازن مثالي للحفاظ على صحتك ونشاطك',
      icon: Heart,
      patients: '4,000+',
    },
  ];

  return (
    <>
      <section className="relative min-h-[95vh] flex items-center justify-center px-6 md:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1535914254981-b5012eebbd15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-accent/95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full mb-8 border border-white/30"
            >
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">ابدأ رحلتك الصحية اليوم</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white">
              رحلتك نحو
              <span className="block mt-3 bg-gradient-to-r from-white via-accent/90 to-white bg-clip-text text-transparent">
                حياة صحية أفضل
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              نظام تغذية ذكي مدعوم بالخبرة الطبية لمساعدتك في تحقيق أهدافك الصحية بطريقة علمية ومستدامة
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0, 194, 54, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShowLogin}
                  className="px-10 py-5 bg-white text-primary rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 hover:shadow-accent/30 transition-all"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>ابدأ الآن مجاناً</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-full font-bold text-lg shadow-lg hover:bg-white/20 transition-all"
                >
                  <span>تعرف على المزيد</span>
                </motion.button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                <CheckCircle className="w-6 h-6 text-white" />
                <span className="text-lg font-bold text-white">مرحباً {userName}! ابدأ رحلتك الصحية</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20"
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">{stat.value}</p>
                <p className="text-foreground font-semibold text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 bg-gradient-to-br from-background via-white to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-bold">لماذا أصِل؟</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">نقدم لك الأفضل</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تجربة صحية متكاملة مع أفضل الأدوات والخبرات الطبية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(0, 158, 42, 0.15)' }}
                  className="bg-white rounded-3xl p-8 border border-primary/10 shadow-xl hover:border-primary/30 transition-all"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.2, type: 'spring', bounce: 0.5 }}
                    className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full mb-6 border border-primary/20"
            >
              <Apple className="w-5 h-5 text-primary" />
              <span className="text-primary font-bold">خططنا الغذائية</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">اختر خطتك المثالية</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              برامج غذائية متكاملة مصممة خصيصاً لتحقيق أهدافك الصحية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10, boxShadow: '0 20px 60px rgba(0, 158, 42, 0.2)' }}
                  className="bg-white rounded-3xl p-8 shadow-xl border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.2, type: 'spring', bounce: 0.5 }}
                    className="inline-flex p-4 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg"
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full">
                      <Users className="w-5 h-5" />
                      <span className="font-bold">{plan.patients}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <Crown className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-xl" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              احصل على الاشتراك المميز
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              استمتع بجميع الميزات الحصرية مع المتابعة المباشرة من الطبيب
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                'خطط غذائية مخصصة بالكامل',
                'مراسلة مباشرة مع الطبيب',
                'تتبع تقدمك بشكل مفصل',
                'توصيات مدعومة بالذكاء الاصطناعي',
                'وصفات طعام حصرية',
                'دعم على مدار الساعة',
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-4 text-right bg-primary/5 p-4 rounded-2xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0, 194, 54, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowLogin}
                className="px-10 py-5 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold text-xl shadow-2xl inline-flex items-center gap-3"
              >
                <Crown className="w-7 h-7" />
                <span>ابدأ الآن</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 bg-gradient-to-br from-primary via-primary to-accent text-white relative overflow-hidden">
    <div className="max-w-4xl mx-auto text-center relative">
       <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1, rotate: 360 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <Zap className="w-20 h-20 mx-auto mb-8 drop-shadow-2xl" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              انضم لآلاف المستخدمين الذين حققوا أهدافهم الصحية معنا
            </p>

            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 25px 70px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowLogin}
                className="px-10 py-5 bg-white text-primary rounded-full font-bold text-xl shadow-2xl inline-flex items-center gap-3"
              >
                <Sparkles className="w-7 h-7" />
                <span>سجل مجاناً الآن</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
