import { Role, PostStatus, PostCategory, FinanceType, FinanceCategory, StudentStatus, AttendanceStatus } from "@prisma/client";

// Re-export Prisma enums
export { Role, PostStatus, PostCategory, FinanceType, FinanceCategory, StudentStatus, AttendanceStatus };

// User types
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

// Post types
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: PostCategory;
  status: PostStatus;
}

// Finance types
export interface FinanceFormData {
  type: FinanceType;
  category: FinanceCategory;
  amount: number;
  description: string;
  date: Date;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}

export interface MonthlyFinanceReport {
  month: string;
  year: number;
  income: number;
  expense: number;
  balance: number;
  transactions: Array<{
    id: string;
    type: FinanceType;
    category: FinanceCategory;
    amount: number;
    description: string;
    date: Date;
  }>;
}

// TPA types
export interface TpaStudentFormData {
  name: string;
  birthDate?: Date;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  className: string;
  schedule?: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  present: number;
  absent: number;
  excused: number;
  late: number;
  total: number;
  attendanceRate: number;
}

// Prayer times
export interface PrayerTime {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTimeWithIqamah extends PrayerTime {
  iqamah: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

// Kajian types
export interface KajianScheduleData {
  id: string;
  title: string;
  speaker: string;
  topic?: string;
  dayOfWeek: number;
  time: string;
  location?: string;
  isActive: boolean;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export interface SidebarItem extends NavItem {
  roles?: Role[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Chart types for Recharts
export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface FinanceChartData {
  month: string;
  income: number;
  expense: number;
}
