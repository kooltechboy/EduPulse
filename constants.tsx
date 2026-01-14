
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  Settings, 
  UserCheck,
  ClipboardList,
  GraduationCap,
  Bus,
  ShieldCheck,
  GitBranch,
  HeartPulse,
  Library,
  Package,
  CalendarDays,
  Coffee,
  Briefcase,
  MonitorPlay,
  Video
} from 'lucide-react';
import { UserRole } from './types';

export interface NavGroup {
  label: string;
  items: { label: string; icon: React.ReactNode; id: string }[];
}

export const NAV_ITEMS_CATEGORIZED: Record<UserRole, NavGroup[]> = {
  [UserRole.ADMIN]: [
    {
      label: 'Core Command',
      items: [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, id: 'dashboard' },
      ]
    },
    {
      label: 'Academic Hub',
      items: [
        { label: 'Classroom (LMS)', icon: <MonitorPlay size={18} />, id: 'classes' },
        { label: 'Student Registry', icon: <Users size={18} />, id: 'students' },
        { label: 'Staff Directory', icon: <UserCheck size={18} />, id: 'staff' },
        { label: 'Master Timetable', icon: <Calendar size={18} />, id: 'timetable' },
      ]
    },
    {
      label: 'Institutional Admin',
      items: [
        { label: 'Human Resources', icon: <Briefcase size={18} />, id: 'hr' },
        { label: 'Financial Core', icon: <CreditCard size={18} />, id: 'finance' },
        { label: 'Campus Inventory', icon: <Package size={18} />, id: 'inventory' },
      ]
    },
    {
      label: 'Operations & Events',
      items: [
        { label: 'Coordination Hub', icon: <GitBranch size={18} />, id: 'coordination' },
        { label: 'Library Node', icon: <Library size={18} />, id: 'library' },
        { label: 'Transport Fleet', icon: <Bus size={18} />, id: 'transport' },
        { label: 'Campus Events', icon: <CalendarDays size={18} />, id: 'events' },
      ]
    },
    {
      label: 'Safety & Wellness',
      items: [
        { label: 'Wellness Center', icon: <HeartPulse size={18} />, id: 'counseling' },
        { label: 'Security Center', icon: <ShieldCheck size={18} />, id: 'security' },
        { label: 'System Config', icon: <Settings size={18} />, id: 'settings' },
      ]
    }
  ],
  [UserRole.TEACHER]: [
    {
      label: 'Faculty Command',
      items: [
        { label: 'Desk Dashboard', icon: <LayoutDashboard size={18} />, id: 'dashboard' },
        { label: 'LMS Classrooms', icon: <MonitorPlay size={18} />, id: 'classes' },
        { label: 'Master Schedule', icon: <Calendar size={18} />, id: 'timetable' },
      ]
    },
    {
      label: 'Instructional',
      items: [
        { label: 'Presence Log', icon: <ClipboardList size={18} />, id: 'attendance' },
        { label: 'Grade Matrix', icon: <GraduationCap size={18} />, id: 'grades' },
      ]
    }
  ],
  [UserRole.STUDENT]: [
    {
      label: 'Learning Pathway',
      items: [
        { label: 'Learning Hub', icon: <LayoutDashboard size={18} />, id: 'dashboard' },
        { label: 'Active Courses', icon: <MonitorPlay size={18} />, id: 'classes' },
        { label: 'Daily Schedule', icon: <Calendar size={18} />, id: 'timetable' },
      ]
    },
    {
      label: 'Services',
      items: [
        { label: 'Bus Tracking', icon: <Bus size={18} />, id: 'transport' },
        { label: 'Meal Booking', icon: <Coffee size={18} />, id: 'canteen' },
      ]
    }
  ],
  [UserRole.PARENT]: [
    {
      label: 'Observer Hub',
      items: [
        { label: 'Guardian Overview', icon: <LayoutDashboard size={18} />, id: 'dashboard' },
        { label: 'Child Performance', icon: <GraduationCap size={18} />, id: 'classes' },
        { label: 'Financial Balance', icon: <CreditCard size={18} />, id: 'finance' },
      ]
    }
  ]
};

export const QUICK_ACTIONS = [
  { label: 'Audit Assets', role: UserRole.ADMIN },
  { label: 'Mark Attendance', role: UserRole.TEACHER },
  { label: 'Hand In Work', role: UserRole.STUDENT },
];
