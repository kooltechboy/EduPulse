import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

export const AnalyticsTab: React.FC = () => {
  const engagementData = [
    { week: 'W1', views: 120, submissions: 20 },
    { week: 'W2', views: 150, submissions: 35 },
    { week: 'W3', views: 180, submissions: 50 },
    { week: 'W4', views: 140, submissions: 45 },
    { week: 'W5', views: 200, submissions: 60 },
  ];

  const gradeData = [
    { range: '90-100', count: 8 },
    { range: '80-89', count: 12 },
    { range: '70-79', count: 3 },
    { range: '60-69', count: 1 },
    { range: '<60', count: 0 },
  ];

  const attendanceData = [
    { day: 'Mon', present: 24 },
    { day: 'Tue', present: 23 },
    { day: 'Wed', present: 24 },
    { day: 'Thu', present: 22 },
    { day: 'Fri', present: 20 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <h2 style={{ margin: 0 }}>Course Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
        
        <div style={{ background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>Weekly Engagement</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }} />
                <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="submissions" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>Grade Distribution</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="range" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }} />
                <Bar dataKey="count" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>Attendance Trend</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-text-secondary)" />
                <YAxis domain={[0, 25]} stroke="var(--color-text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }} />
                <Line type="monotone" dataKey="present" stroke="var(--color-success-500)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};
