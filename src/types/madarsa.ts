export interface Madarsa {
  id: string;
  name?: string; // Legacy fallback
  city?: string; // Legacy fallback
  state?: string; // Legacy fallback
  totalStudents?: number; // Legacy fallback
  totalTeachers?: number; // Legacy fallback
  classes?: string[]; // Legacy fallback
  basicInfo?: {
    nameEnglish: string;
    established: string;
  };
  location?: {
    address: string;
    city: string;
    state: string;
  };
  academic?: {
    totalStudents: number;
    teachers: number;
    staff: number;
    classes: string[];
  };
  media?: {
    logo?: string;
    coverPhoto?: string;
  };
  meta?: {
    status: 'pending' | 'verified' | 'rejected';
    createdBy: string;
    updatedAt: number;
  };
  description?: {
    about: string;
  };
  facilities?: Record<string, boolean>;
  createdAt: any;
  updatedAt: any;
}

export interface Teacher {
  id: string;
  name: string;
  qualification: string;
  experience: number;
  subjects: string[];
  assignedClasses: string[];
  madarsaId: string;
  isAdmin: boolean;
  contactNumber?: string;
  email?: string;
}

export interface Student {
  id: string;
  name: string;
  fatherName: string;
  classId: string;
  rollNumber: string;
  admissionDate: Date;
  status: 'active' | 'inactive';
  madarsaId: string;
  contactNumber?: string;
  address?: string;
}

export interface MadarsaClass {
  id: string;
  name: string;
  subjects: string[];
  teacherId?: string;
  madarsaId: string;
  totalStudents: number;
}

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'public';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  madarsaId?: string;
  profileImage?: string;
}
