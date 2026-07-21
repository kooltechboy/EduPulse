import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock } from 'lucide-react';
import './CourseView.css';
import { StreamTab } from './tabs/StreamTab';
import { CurriculumTab } from './tabs/CurriculumTab';
import { AssessmentTab } from './tabs/AssessmentTab';
import { ResourcesTab } from './tabs/ResourcesTab';
import { CohortTab } from './tabs/CohortTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';

type Tab = 'stream' | 'curriculum' | 'assessments' | 'resources' | 'cohort' | 'analytics';

export const CourseView: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('stream');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'stream', label: 'Stream' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'resources', label: 'Resources' },
    { id: 'cohort', label: 'Cohort' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="ep-course-view">
      <div className="ep-course-view__header">
        <button className="ep-btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="ep-course-view__title">
          <h1>Advanced Mathematics (MATH401)</h1>
          <div className="ep-course-view__meta">
            <span>Teacher: Dr. Smith</span>
            <span><Clock size={14} /> Mon, Wed, Fri 9:00 AM</span>
            <span><Users size={14} /> 24 Students</span>
          </div>
        </div>
      </div>

      <div className="ep-course-view__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`ep-tab-btn ${activeTab === tab.id ? 'ep-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ep-course-view__content">
        {activeTab === 'stream' && <StreamTab />}
        {activeTab === 'curriculum' && <CurriculumTab />}
        {activeTab === 'assessments' && <AssessmentTab />}
        {activeTab === 'resources' && <ResourcesTab />}
        {activeTab === 'cohort' && <CohortTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};
