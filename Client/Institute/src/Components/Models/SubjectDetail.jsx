import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import ContentManagement from './ContentManagement';
import AttendanceTab from './AttendanceTab';
import AssignmentsTab from './AssignmentsTab';
import StudentStatsTab from './StudentStatsTab';

const SubjectDetail = ({ subject, onBack }) => {
  const [activeTab, setActiveTab] = useState('content');

  const tabs = [
    { id: 'content', label: 'Content Management', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'stats', label: 'Student Stats', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentManagement subjectId={subject.id} />;
      case 'attendance':
        return <AttendanceTab subjectId={subject.id} />;
      case 'assignments':
        return <AssignmentsTab subjectId={subject.id} />;
      case 'stats':
        return <StudentStatsTab subjectId={subject.id} />;
      default:
        return <ContentManagement subjectId={subject.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {subject.name}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">{subject.code}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {subject.instructor}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {subject.totalStudents} students
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">{renderTabContent()}</div>
    </div>
  );
};

export default SubjectDetail;
