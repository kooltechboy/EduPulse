import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  GraduationCap,
  Users,
  LayoutGrid,
  Zap,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore, DEMO_USERS, type UserRole } from '@/stores/authStore';
import { isSupabaseConfigured } from '@/services/supabaseClient';
import './Auth.css';

interface RoleCard {
  role: UserRole;
  icon: React.ElementType;
  label: string;
  desc: string;
  gradient: string;
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'admin',
    icon: Shield,
    label: 'Administrator',
    desc: 'Full system access, analytics & settings',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  },
  {
    role: 'teacher',
    icon: BookOpen,
    label: 'Teacher',
    desc: 'Classrooms, gradebook & attendance',
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
  },
  {
    role: 'student',
    icon: GraduationCap,
    label: 'Student',
    desc: 'Assignments, schedule & AI tutor',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
  },
  {
    role: 'parent',
    icon: Users,
    label: 'Parent',
    desc: 'Grades, attendance & payments',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
  },
  {
    role: 'coordinator',
    icon: LayoutGrid,
    label: 'Coordinator',
    desc: 'Curriculum oversight & evaluations',
    gradient: 'linear-gradient(135deg, #e11d48, #be123c)',
  },
];

export const LoginScreen: React.FC = () => {
  const { login, loginWithSupabase, signUpWithSupabase, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'demo' | 'enterprise'>('demo');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');

  const handleDemoLogin = (role: UserRole) => {
    const user = DEMO_USERS[role];
    login(user);
    navigate('/dashboard');
  };

  const handleEnterpriseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const success = await signUpWithSupabase(email, password, name, selectedRole);
      if (success) navigate('/dashboard');
    } else {
      const success = await loginWithSupabase(email, password);
      if (success) navigate('/dashboard');
    }
  };

  return (
    <div className="ep-auth">
      {/* Animated background orbs */}
      <div className="ep-auth__bg">
        <div className="ep-auth__orb ep-auth__orb--1" />
        <div className="ep-auth__orb ep-auth__orb--2" />
        <div className="ep-auth__orb ep-auth__orb--3" />
      </div>

      <div className="ep-auth__content">
        {/* Brand */}
        <div className="ep-auth__brand">
          <div className="ep-auth__brand-icon">
            <Zap size={32} />
          </div>
          <h1 className="ep-auth__brand-name">EduPulse</h1>
          <p className="ep-auth__brand-tagline">
            Intelligent School &amp; Learning Management Platform
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div style={{ display: 'flex', gap: '12px', background: 'var(--glass-bg)', padding: '6px', borderRadius: '16px', border: 'var(--glass-border)' }}>
          <button
            type="button"
            onClick={() => setAuthMode('demo')}
            style={{
              padding: '8px 20px',
              borderRadius: '12px',
              border: 'none',
              background: authMode === 'demo' ? 'var(--color-primary-600)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} /> 1-Click Demo Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('enterprise')}
            style={{
              padding: '8px 20px',
              borderRadius: '12px',
              border: 'none',
              background: authMode === 'enterprise' ? 'var(--color-primary-600)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock size={16} /> Supabase Auth {isSupabaseConfigured ? '🟢 Live' : '🟠 Mock'}
          </button>
        </div>

        {authMode === 'demo' ? (
          <>
            <p className="ep-auth__prompt">Select your role to enter workspace</p>
            <div className="ep-auth__grid">
              {ROLE_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.role}
                    className="ep-auth__role-card"
                    onClick={() => handleDemoLogin(card.role)}
                    aria-label={`Login as ${card.label}`}
                  >
                    <div
                      className="ep-auth__role-icon"
                      style={{ background: card.gradient }}
                    >
                      <Icon size={28} color="white" />
                    </div>
                    <h3 className="ep-auth__role-label">{card.label}</h3>
                    <p className="ep-auth__role-desc">{card.desc}</p>
                    <div className="ep-auth__role-arrow">→</div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <form
            onSubmit={handleEnterpriseAuth}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(var(--glass-blur))',
              border: 'var(--glass-border)',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, textAlign: 'center', color: 'var(--color-text-primary)' }}>
              {isSignUp ? 'Create EduPulse Account' : 'Enterprise Supabase Login'}
            </h2>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#f87171', fontSize: '13px' }}>
                {error}
              </div>
            )}

            {isSignUp && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserCheck size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-tertiary)' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Alex Rivera"
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: 'var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)', color: 'white', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>School Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-tertiary)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@edupulse.edu"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: 'var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)', color: 'white', fontSize: '14px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-tertiary)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: 'var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)', color: 'white', fontSize: '14px' }}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Assign System Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: 'var(--glass-border)', background: '#1e1b4b', color: 'white', fontSize: '14px' }}
                >
                  <option value="admin">Administrator</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? 'Authenticating...' : isSignUp ? 'Register Account' : 'Sign In'} <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', fontSize: '13px', cursor: 'pointer', textAlign: 'center' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
            </button>
          </form>
        )}

        <p className="ep-auth__footer">
          EduPulse Enterprise · NASA-Grade High-Reliability Architecture
        </p>
      </div>
    </div>
  );
};
