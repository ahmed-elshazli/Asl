import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  MessageCircle,
  TrendingUp,
  Calendar,
  Crown,
  Search,
  Plus,
  Mail,
  Phone,
  LogOut,
  Apple,
  Award,
  Activity,
  DollarSign,
  ChevronRight,
  Send,
  X,
  Save,
  Trash2,
  Edit,
  Filter,
  Download,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface DoctorDashboardProps {
  onLogout: () => void;
}

export default function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = [
    { label: 'إجمالي المرضى', value: '248', icon: Users, trend: '+12%', color: 'from-primary to-accent' },
    { label: 'المشتركون المميزون', value: '156', icon: Crown, trend: '+8%', color: 'from-accent to-primary' },
    { label: 'رسائل جديدة', value: '23', icon: MessageCircle, trend: '+5', color: 'from-primary to-accent' },
    { label: 'الإيرادات الشهرية', value: '24,500 ر.س', icon: DollarSign, trend: '+15%', color: 'from-accent to-primary' },
  ];

  const recentPatients = [
    { name: 'محمد أحمد', goal: 'إنقاص وزن', progress: 75, status: 'premium', lastVisit: 'اليوم' },
    { name: 'فاطمة علي', goal: 'زيادة وزن', progress: 60, status: 'premium', lastVisit: 'أمس' },
    { name: 'أحمد خالد', goal: 'نمط حياة صحي', progress: 85, status: 'free', lastVisit: 'منذ 3 أيام' },
    { name: 'نورة سعيد', goal: 'إنقاص وزن', progress: 45, status: 'premium', lastVisit: 'منذ يومين' },
    { name: 'سارة محمود', goal: 'بناء عضلات', progress: 70, status: 'premium', lastVisit: 'اليوم' },
  ];

  const monthlyData = [
    { month: 'يناير', patients: 180, revenue: 18000 },
    { month: 'فبراير', patients: 195, revenue: 19500 },
    { month: 'مارس', patients: 210, revenue: 21000 },
    { month: 'أبريل', patients: 225, revenue: 22500 },
    { month: 'مايو', patients: 248, revenue: 24500 },
  ];

  const goalDistribution = [
    { name: 'إنقاص وزن', value: 45, color: '#009E2A' },
    { name: 'زيادة وزن', value: 25, color: '#00C236' },
    { name: 'نمط صحي', value: 30, color: '#E8F5ED' },
  ];

  const messages = [
    { patient: 'محمد أحمد', message: 'هل يمكنني زيادة السعرات قليلاً؟', time: 'منذ 10 دقائق', unread: true },
    { patient: 'فاطمة علي', message: 'شكراً على الخطة الجديدة', time: 'منذ ساعة', unread: true },
    { patient: 'نورة سعيد', message: 'أحتاج استشارة بخصوص النظام', time: 'منذ ساعتين', unread: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hamburger Button - Mobile Only */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 right-4 z-40 lg:hidden w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-primary/10"
      >
        <Menu className="w-6 h-6 text-primary" />
      </motion.button>

      {/* Backdrop - Mobile Only */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex">
        <aside
          className={`
            w-72 bg-white border-l border-primary/10 min-h-screen p-6
            lg:block lg:sticky lg:top-0
            fixed top-0 right-0 z-50 lg:z-auto
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:translate-x-0
            transition-transform duration-300 ease-in-out lg:transition-none
          `}
        >
          {/* Close Button - Mobile Only */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 left-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                د.س
              </div>
              <div>
                <h3 className="font-bold">د. سارة أحمد</h3>
                <p className="text-sm text-muted-foreground">أخصائية تغذية</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'لوحة التحكم', icon: Activity },
              { id: 'patients', label: 'المرضى', icon: Users },
              { id: 'messages', label: 'الرسائل', icon: MessageCircle },
              { id: 'plans', label: 'الخطط الغذائية', icon: Apple },
              { id: 'analytics', label: 'الإحصائيات', icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="mt-auto pt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">تسجيل الخروج</span>
            </motion.button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8">
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">لوحة التحكم</h1>
                <p className="text-muted-foreground text-base md:text-lg">مرحباً د. سارة، إليك ملخص اليوم</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">نمو المرضى والإيرادات</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <XAxis key="x-axis" dataKey="month" stroke="#6B7280" />
                      <YAxis key="y-axis" stroke="#6B7280" />
                      <Tooltip
                        key="tooltip"
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #009E2A20',
                          borderRadius: '1rem',
                        }}
                      />
                      <Line
                        key="patients-line"
                        type="monotone"
                        dataKey="patients"
                        stroke="#009E2A"
                        strokeWidth={3}
                        dot={{ fill: '#009E2A', r: 5 }}
                        name="المرضى"
                      />
                      <Line
                        key="revenue-line"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#00C236"
                        strokeWidth={3}
                        dot={{ fill: '#00C236', r: 5 }}
                        name="الإيرادات"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border border-primary/10">
                  <h2 className="text-2xl font-bold mb-6">توزيع الأهداف</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        key="goals-pie"
                        data={goalDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {goalDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {goalDistribution.map((goal) => (
                      <div key={goal.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: goal.color }}
                          />
                          <span className="text-sm">{goal.name}</span>
                        </div>
                        <span className="font-bold">{goal.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">المرضى الحديثون</h2>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAssignPlanModal(true)}
                        className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <Apple className="w-4 h-4" />
                        <span className="hidden md:inline">تعيين خطة</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddPatientModal(true)}
                        className="px-4 py-2 bg-gradient-to-br from-primary to-accent text-white rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة مريض</span>
                      </motion.button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {recentPatients.slice(0, 5).map((patient, idx) => (
                      <motion.div
                        key={patient.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        whileHover={{ scale: 1.02, x: -5 }}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{patient.name}</h4>
                            {patient.status === 'premium' && (
                              <Crown className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{patient.goal}</p>
                          <div className="mt-2 bg-secondary rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                              style={{ width: `${patient.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">الرسائل الحديثة</h2>
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {messages.filter((m) => m.unread).length}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.patient}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        whileHover={{ scale: 1.02, x: -5 }}
                        className={`p-4 rounded-2xl hover:bg-secondary cursor-pointer transition-all ${
                          msg.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold">{msg.patient}</h4>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'patients' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">إدارة المرضى</h1>
                  <p className="text-muted-foreground text-base md:text-lg">جميع المرضى المسجلين</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddPatientModal(true)}
                  className="px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">إضافة مريض جديد</span>
                  <span className="sm:hidden">إضافة مريض</span>
                </motion.button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg">
                <div className="relative mb-6">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ابحث عن مريض..."
                    className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-3">
                  {recentPatients.map((patient, idx) => (
                    <motion.div
                      key={patient.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01, x: -5 }}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowPatientDetails(true);
                      }}
                      className="flex items-center gap-3 md:gap-6 p-4 md:p-6 rounded-2xl hover:bg-secondary cursor-pointer transition-all border border-primary/5"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                          <h3 className="text-base md:text-xl font-bold truncate">{patient.name}</h3>
                          {patient.status === 'premium' && (
                            <div className="px-3 py-1 bg-gradient-to-br from-primary to-accent text-white rounded-full text-xs font-bold flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              <span>مميز</span>
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{patient.goal}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>آخر زيارة: {patient.lastVisit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">التقدم</p>
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke="#E8F5ED"
                              strokeWidth="6"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke={`url(#progress-gradient-${idx})`}
                              strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 35}`}
                              strokeDashoffset={`${2 * Math.PI * 35 * (1 - patient.progress / 100)}`}
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id={`progress-gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop key={`stop-1-${idx}`} offset="0%" stopColor="#009E2A" />
                                <stop key={`stop-2-${idx}`} offset="100%" stopColor="#00C236" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">{patient.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-2xl md:text-4xl font-bold mb-2">الرسائل</h1>
              <p className="text-muted-foreground text-base md:text-lg mb-8">تواصل مع مرضاك</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg">
                    <div className="relative mb-4">
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="ابحث عن محادثة..."
                        className="w-full pr-12 pl-6 py-3 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      {recentPatients.filter(p => p.status === 'premium').map((patient, idx) => (
                        <motion.div
                          key={patient.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedConversation(patient)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all ${
                            selectedConversation?.name === patient.name
                              ? 'bg-gradient-to-br from-primary to-accent text-white'
                              : 'hover:bg-secondary'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                              selectedConversation?.name === patient.name
                                ? 'bg-white/20'
                                : 'bg-gradient-to-br from-primary to-accent text-white'
                            }`}>
                              {patient.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold truncate">{patient.name}</h4>
                              <p className={`text-sm truncate ${
                                selectedConversation?.name === patient.name
                                  ? 'text-white/80'
                                  : 'text-muted-foreground'
                              }`}>
                                آخر رسالة من المريض...
                              </p>
                            </div>
                            {idx < 2 && (
                              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {idx + 1}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-3xl border border-primary/10 shadow-lg overflow-hidden flex flex-col" style={{ height: '700px' }}>
                  {selectedConversation ? (
                    <>
                      <div className="bg-gradient-to-br from-primary to-accent p-6 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center font-bold text-xl">
                            {selectedConversation.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{selectedConversation.name}</h3>
                            <p className="text-sm text-white/80">متصل الآن</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end"
                        >
                          <div className="max-w-[70%] p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white rounded-bl-sm">
                            <p className="mb-1">مرحباً! كيف كان أسبوعك مع الخطة الغذائية؟</p>
                            <p className="text-xs text-white/70">10:30 صباحاً</p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[70%] p-4 rounded-2xl bg-secondary text-foreground rounded-br-sm">
                            <p className="mb-1">كان رائعاً دكتورة! التزمت بالخطة ولاحظت تحسن كبير</p>
                            <p className="text-xs text-muted-foreground">10:45 صباحاً</p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end"
                        >
                          <div className="max-w-[70%] p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white rounded-bl-sm">
                            <p className="mb-1">ممتاز! دعنا نعدل البروتين قليلاً في الإفطار</p>
                            <p className="text-xs text-white/70">11:00 صباحاً</p>
                          </div>
                        </motion.div>
                      </div>

                      <div className="p-6 border-t border-primary/10">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="اكتب رسالتك..."
                            className="flex-1 px-6 py-4 bg-secondary rounded-full border-none outline-none focus:ring-2 focus:ring-primary"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-lg"
                          >
                            <Send className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">اختر محادثة</h3>
                        <p className="text-muted-foreground">اختر مريض من القائمة لبدء المحادثة</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'plans' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">الخطط الغذائية</h1>
                  <p className="text-muted-foreground text-base md:text-lg">إدارة وإنشاء خطط غذائية مخصصة</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddPlanModal(true)}
                    className="px-4 md:px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span>خطة جديدة</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAssignPlanModal(true)}
                    className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-full font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <Users className="w-5 h-5" />
                    <span>تعيين خطة لمريض</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'خطة إنقاص الوزن - أساسية', patients: 45, calories: '1500-1800', type: 'إنقاص وزن' },
                  { name: 'خطة الكيتو المتقدمة', patients: 28, calories: '1600-1900', type: 'إنقاص وزن' },
                  { name: 'خطة بناء العضلات', patients: 32, calories: '2800-3200', type: 'زيادة وزن' },
                  { name: 'نظام البحر المتوسط', patients: 56, calories: '2000-2300', type: 'صحي' },
                  { name: 'خطة نباتية متوازنة', patients: 19, calories: '1900-2200', type: 'صحي' },
                  { name: 'خطة الرياضيين', patients: 24, calories: '3000-3500', type: 'زيادة وزن' },
                ].map((plan, idx) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl">
                        <Apple className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.type}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">عدد المرضى</span>
                        <span className="font-bold text-primary">{plan.patients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">السعرات</span>
                        <span className="font-bold">{plan.calories}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-3 bg-secondary rounded-2xl font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      عرض التفاصيل
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">الإحصائيات والتحليلات</h1>
                  <p className="text-muted-foreground text-base md:text-lg">تحليل شامل للأداء والنتائج</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 md:px-6 py-3 bg-white rounded-full font-semibold flex items-center gap-2 border border-primary/10 shadow-lg text-sm md:text-base"
                  >
                    <Filter className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="hidden sm:inline">تصفية</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 md:px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm md:text-base"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">تصدير</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl p-6 border border-primary/10 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">معدل النجاح حسب نوع الخطة</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { type: 'إنقاص وزن', success: 85, total: 100 },
                      { type: 'زيادة وزن', success: 78, total: 100 },
                      { type: 'صحي', success: 92, total: 100 },
                    ]}>
                      <XAxis key="bar-x-axis" dataKey="type" stroke="#6B7280" />
                      <YAxis key="bar-y-axis" stroke="#6B7280" />
                      <Tooltip
                        key="bar-tooltip"
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #009E2A20',
                          borderRadius: '1rem',
                        }}
                      />
                      <Bar key="success-bar" dataKey="success" fill="url(#successGradient)" radius={[12, 12, 0, 0]} />
                      <defs key="bar-defs">
                        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop key="stop-1" offset="0%" stopColor="#009E2A" />
                          <stop key="stop-2" offset="100%" stopColor="#00C236" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">الإيرادات الشهرية</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <defs key="area-defs">
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop key="stop-1" offset="5%" stopColor="#009E2A" stopOpacity={0.3} />
                          <stop key="stop-2" offset="95%" stopColor="#00C236" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis key="area-x-axis" dataKey="month" stroke="#6B7280" />
                      <YAxis key="area-y-axis" stroke="#6B7280" />
                      <Tooltip
                        key="area-tooltip"
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #009E2A20',
                          borderRadius: '1rem',
                        }}
                      />
                      <Area
                        key="revenue-area"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#009E2A"
                        strokeWidth={3}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">أفضل المرضى أداءً</h2>
                <div className="space-y-3">
                  {recentPatients
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 5)
                    .map((patient, idx) => (
                      <motion.div
                        key={patient.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary transition-all"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold">
                          {idx + 1}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{patient.name}</h4>
                          <p className="text-sm text-muted-foreground">{patient.goal}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                            {patient.progress}%
                          </div>
                          <p className="text-xs text-muted-foreground">التقدم</p>
                        </div>
                        <Award className="w-6 h-6 text-accent" />
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showAddPatientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddPatientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddPatientModal(false)}
                className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                  <Plus className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">إضافة مريض جديد</h2>
                <p className="text-muted-foreground">أدخل بيانات المريض الأساسية</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      placeholder="محمد أحمد"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      placeholder="+966 50 123 4567"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">تاريخ الميلاد</label>
                    <input
                      type="date"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">الوزن الحالي (كجم)</label>
                    <input
                      type="number"
                      placeholder="75"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">الطول (سم)</label>
                    <input
                      type="number"
                      placeholder="175"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">الوزن المستهدف (كجم)</label>
                    <input
                      type="number"
                      placeholder="70"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">الهدف الصحي</label>
                  <select className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary">
                    <option>إنقاص الوزن</option>
                    <option>زيادة الوزن</option>
                    <option>نمط حياة صحي</option>
                    <option>بناء العضلات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">مستوى النشاط</label>
                  <select className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary">
                    <option>قليل النشاط</option>
                    <option>نشاط معتدل</option>
                    <option>نشاط عالي</option>
                    <option>رياضي محترف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">نوع الاشتراك</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 bg-secondary rounded-2xl cursor-pointer hover:bg-primary/10 transition-all">
                      <input type="radio" name="subscription" className="w-5 h-5 text-primary" />
                      <span className="font-semibold">مجاني</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl cursor-pointer hover:from-primary/20 hover:to-accent/20 transition-all border-2 border-primary/20">
                      <input type="radio" name="subscription" className="w-5 h-5 text-primary" defaultChecked />
                      <Crown className="w-5 h-5 text-primary" />
                      <span className="font-semibold">مميز</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddPatientModal(false)}
                    className="flex-1 py-4 bg-secondary rounded-full font-bold text-foreground"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>حفظ المريض</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showPatientDetails && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPatientDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPatientDetails(false)}
                className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <div className="mb-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-4xl">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{selectedPatient.name}</h2>
                      {selectedPatient.status === 'premium' && (
                        <div className="px-4 py-1 bg-gradient-to-br from-primary to-accent text-white rounded-full text-sm font-bold flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          <span>مميز</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-lg">{selectedPatient.goal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-1">التقدم</p>
                    <p className="text-2xl font-bold text-primary">{selectedPatient.progress}%</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-1">آخر زيارة</p>
                    <p className="text-xl font-bold">{selectedPatient.lastVisit}</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-1">الوزن الحالي</p>
                    <p className="text-xl font-bold">78.5 كجم</p>
                  </div>
                  <div className="bg-secondary p-4 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-1">الهدف</p>
                    <p className="text-xl font-bold">75 كجم</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-secondary p-6 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4">المعلومات الشخصية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                        <p className="font-semibold">mohamed@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                        <p className="font-semibold">+966 50 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
                        <p className="font-semibold">1 يناير 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">مستوى النشاط</p>
                        <p className="font-semibold">نشاط معتدل</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-primary/10 p-6 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4">الخطة الحالية</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl">
                      <span className="font-semibold">خطة إنقاص الوزن - أساسية</span>
                      <span className="text-primary font-bold">1500-1800 كالوري</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                        <p className="text-sm text-muted-foreground mb-1">بروتين</p>
                        <p className="font-bold text-primary">30%</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                        <p className="text-sm text-muted-foreground mb-1">كربوهيدرات</p>
                        <p className="font-bold text-primary">45%</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                        <p className="text-sm text-muted-foreground mb-1">دهون</p>
                        <p className="font-bold text-primary">25%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowPatientDetails(false);
                      setShowAssignPlanModal(true);
                    }}
                    className="py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Apple className="w-5 h-5" />
                    <span>تعيين خطة</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-4 bg-secondary rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    <Edit className="w-5 h-5 text-primary" />
                    <span>تعديل الخطة</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-4 bg-secondary rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span>إرسال رسالة</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAddPlanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddPlanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddPlanModal(false)}
                className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                  <Apple className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">إنشاء خطة غذائية جديدة</h2>
                <p className="text-muted-foreground">صمم خطة غذائية متكاملة لمرضاك</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">اسم الخطة</label>
                    <input
                      type="text"
                      placeholder="خطة إنقاص الوزن - أساسية"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">نوع الخطة</label>
                    <select className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary">
                      <option>إنقاص الوزن</option>
                      <option>زيادة الوزن</option>
                      <option>نمط حياة صحي</option>
                      <option>بناء عضلات</option>
                      <option>رياضيين</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">السعرات (من)</label>
                    <input
                      type="number"
                      placeholder="1500"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">السعرات (إلى)</label>
                    <input
                      type="number"
                      placeholder="1800"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">المدة (بالأشهر)</label>
                    <input
                      type="number"
                      placeholder="3"
                      className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-3xl">
                  <h3 className="text-lg font-bold mb-4">توزيع المغذيات (%)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">بروتين</label>
                      <input
                        type="number"
                        placeholder="30"
                        className="w-full px-6 py-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">كربوهيدرات</label>
                      <input
                        type="number"
                        placeholder="45"
                        className="w-full px-6 py-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">دهون</label>
                      <input
                        type="number"
                        placeholder="25"
                        className="w-full px-6 py-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">الوجبات اليومية</h3>
                  <div className="space-y-4">
                    {['الإفطار', 'سناك صباحي', 'الغداء', 'سناك مسائي', 'العشاء'].map((meal) => (
                      <div key={meal} className="bg-secondary p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold">{meal}</h4>
                          <input
                            type="text"
                            placeholder="8:00 صباحاً"
                            className="px-4 py-2 bg-white rounded-xl border-none outline-none focus:ring-2 focus:ring-primary w-32 text-sm"
                          />
                        </div>
                        <textarea
                          placeholder="أدخل مكونات الوجبة..."
                          rows={2}
                          className="w-full px-4 py-3 bg-white rounded-xl border-none outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                        />
                        <div className="mt-2">
                          <input
                            type="number"
                            placeholder="السعرات"
                            className="w-32 px-4 py-2 bg-white rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">إرشادات وملاحظات</label>
                  <textarea
                    placeholder="أدخل الإرشادات المهمة (كل إرشاد في سطر منفصل)"
                    rows={4}
                    className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddPlanModal(false)}
                    className="flex-1 py-4 bg-secondary rounded-full font-bold"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>حفظ الخطة</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showAssignPlanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAssignPlanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAssignPlanModal(false)}
                className="absolute top-6 left-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">تعيين خطة لمريض</h2>
                <p className="text-muted-foreground">اختر المريض والخطة المناسبة له</p>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">اختر المريض</label>
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ابحث عن مريض..."
                      className="w-full pr-12 pl-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary mb-4"
                    />
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {recentPatients.map((patient) => (
                      <motion.label
                        key={patient.name}
                        whileHover={{ scale: 1.02, x: -5 }}
                        className="flex items-center gap-4 p-4 bg-secondary rounded-2xl cursor-pointer hover:bg-primary/10 transition-all"
                      >
                        <input type="radio" name="patient" className="w-5 h-5 text-primary" />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{patient.name}</h4>
                            {patient.status === 'premium' && (
                              <Crown className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{patient.goal}</p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">اختر الخطة الغذائية</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {[
                      { name: 'خطة إنقاص الوزن - أساسية', calories: '1500-1800', type: 'إنقاص وزن' },
                      { name: 'خطة الكيتو المتقدمة', calories: '1600-1900', type: 'إنقاص وزن' },
                      { name: 'خطة بناء العضلات', calories: '2800-3200', type: 'زيادة وزن' },
                      { name: 'نظام البحر المتوسط', calories: '2000-2300', type: 'صحي' },
                    ].map((plan) => (
                      <motion.label
                        key={plan.name}
                        whileHover={{ scale: 1.02, x: -5 }}
                        className="flex items-center gap-4 p-4 bg-secondary rounded-2xl cursor-pointer hover:bg-primary/10 transition-all"
                      >
                        <input type="radio" name="plan" className="w-5 h-5 text-primary" />
                        <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
                          <Apple className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{plan.name}</h4>
                          <p className="text-sm text-muted-foreground">{plan.type} • {plan.calories} كالوري</p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">تاريخ البدء</label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">ملاحظات إضافية (اختياري)</label>
                  <textarea
                    placeholder="أي ملاحظات خاصة بهذا المريض..."
                    rows={3}
                    className="w-full px-6 py-4 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAssignPlanModal(false)}
                    className="flex-1 py-4 bg-secondary rounded-full font-bold"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-br from-primary to-accent text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>تعيين الخطة</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}