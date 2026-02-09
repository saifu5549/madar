export interface Madarsa {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  state: string;
  contactNumber?: string;
  email?: string;
  establishedYear?: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  classes: string[];
  description?: string;
  logoUrl?: string;
  images?: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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
