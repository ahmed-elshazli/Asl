import { Users, Crown, MessageCircle, DollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==================== Types ====================

export interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
}

export interface Patient {
  name: string;
  goal: string;
  progress: number;
  status: string;
  lastVisit: string;
}

export interface MonthlyData {
  month: string;
  patients: number;
  revenue: number;
}

export interface GoalDistribution {
  name: string;
  value: number;
  color: string;
}

export interface Message {
  patient: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface DietPlan {
  name: string;
  patients: number;
  calories: string;
  type: string;
}

export interface AssignablePlan {
  name: string;
  calories: string;
  type: string;
}

// ==================== Data ====================

export const stats: Stat[] = [
  { label: 'إجمالي المرضى', value: '248', icon: Users, trend: '+12%', color: 'from-primary to-accent' },
  { label: 'المشتركون المميزون', value: '156', icon: Crown, trend: '+8%', color: 'from-accent to-primary' },
  { label: 'رسائل جديدة', value: '23', icon: MessageCircle, trend: '+5', color: 'from-primary to-accent' },
  { label: 'الإيرادات الشهرية', value: '24,500 ر.س', icon: DollarSign, trend: '+15%', color: 'from-accent to-primary' },
];

export const recentPatients: Patient[] = [
  { name: 'محمد أحمد', goal: 'إنقاص وزن', progress: 75, status: 'premium', lastVisit: 'اليوم' },
  { name: 'فاطمة علي', goal: 'زيادة وزن', progress: 60, status: 'premium', lastVisit: 'أمس' },
  { name: 'أحمد خالد', goal: 'نمط حياة صحي', progress: 85, status: 'free', lastVisit: 'منذ 3 أيام' },
  { name: 'نورة سعيد', goal: 'إنقاص وزن', progress: 45, status: 'premium', lastVisit: 'منذ يومين' },
  { name: 'سارة محمود', goal: 'بناء عضلات', progress: 70, status: 'premium', lastVisit: 'اليوم' },
];

export const monthlyData: MonthlyData[] = [
  { month: 'يناير', patients: 180, revenue: 18000 },
  { month: 'فبراير', patients: 195, revenue: 19500 },
  { month: 'مارس', patients: 210, revenue: 21000 },
  { month: 'أبريل', patients: 225, revenue: 22500 },
  { month: 'مايو', patients: 248, revenue: 24500 },
];

export const goalDistribution: GoalDistribution[] = [
  { name: 'إنقاص وزن', value: 45, color: '#009E2A' },
  { name: 'زيادة وزن', value: 25, color: '#00C236' },
  { name: 'نمط صحي', value: 30, color: '#E8F5ED' },
];

export const messages: Message[] = [
  { patient: 'محمد أحمد', message: 'هل يمكنني زيادة السعرات قليلاً؟', time: 'منذ 10 دقائق', unread: true },
  { patient: 'فاطمة علي', message: 'شكراً على الخطة الجديدة', time: 'منذ ساعة', unread: true },
  { patient: 'نورة سعيد', message: 'أحتاج استشارة بخصوص النظام', time: 'منذ ساعتين', unread: false },
];

export const dietPlans: DietPlan[] = [
  { name: 'خطة إنقاص الوزن - أساسية', patients: 45, calories: '1500-1800', type: 'إنقاص وزن' },
  { name: 'خطة الكيتو المتقدمة', patients: 28, calories: '1600-1900', type: 'إنقاص وزن' },
  { name: 'خطة بناء العضلات', patients: 32, calories: '2800-3200', type: 'زيادة وزن' },
  { name: 'نظام البحر المتوسط', patients: 56, calories: '2000-2300', type: 'صحي' },
  { name: 'خطة نباتية متوازنة', patients: 19, calories: '1900-2200', type: 'صحي' },
  { name: 'خطة الرياضيين', patients: 24, calories: '3000-3500', type: 'زيادة وزن' },
];

export const assignablePlans: AssignablePlan[] = [
  { name: 'خطة إنقاص الوزن - أساسية', calories: '1500-1800', type: 'إنقاص وزن' },
  { name: 'خطة الكيتو المتقدمة', calories: '1600-1900', type: 'إنقاص وزن' },
  { name: 'خطة بناء العضلات', calories: '2800-3200', type: 'زيادة وزن' },
  { name: 'نظام البحر المتوسط', calories: '2000-2300', type: 'صحي' },
];

export const successRateData = [
  { type: 'إنقاص وزن', success: 85, total: 100 },
  { type: 'زيادة وزن', success: 78, total: 100 },
  { type: 'صحي', success: 92, total: 100 },
];