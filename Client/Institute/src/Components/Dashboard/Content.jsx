import React, { useState } from 'react';
import Dashboard from './ContentDashboard';
import SubjectDetail from '../Models/SubjectDetail';

// Mock data
const batches = [
  { id: '1', name: 'Batch 2024-A', year: '2024', semester: 'First' },
  { id: '2', name: 'Batch 2024-B', year: '2024', semester: 'Second' },
  { id: '3', name: 'Batch 2023-A', year: '2023', semester: 'Third' },
];

const subjects = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    code: 'CS101',
    batchId: '1',
    instructor: 'Dr. Sarah Johnson',
    totalStudents: 45,
    totalChapters: 12,
    completedChapters: 8,
    lastUpdated: '2024-12-19',
    description:
      'Fundamental concepts of data structures and algorithmic thinking',
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS201',
    batchId: '1',
    instructor: 'Prof. Michael Chen',
    totalStudents: 42,
    totalChapters: 10,
    completedChapters: 6,
    lastUpdated: '2024-12-18',
    description:
      'Comprehensive study of database design, implementation, and management',
  },
  {
    id: '3',
    name: 'Computer Networks',
    code: 'CS301',
    batchId: '2',
    instructor: 'Dr. Emily Rodriguez',
    totalStudents: 38,
    totalChapters: 8,
    completedChapters: 5,
    lastUpdated: '2024-12-17',
    description: 'Network protocols, architecture, and distributed systems',
  },
  {
    id: '4',
    name: 'Machine Learning',
    code: 'CS401',
    batchId: '3',
    instructor: 'Dr. James Wilson',
    totalStudents: 35,
    totalChapters: 14,
    completedChapters: 12,
    lastUpdated: '2024-12-19',
    description: 'Introduction to machine learning algorithms and applications',
  },
  {
    id: '5',
    name: 'Web Development',
    code: 'CS202',
    batchId: '1',
    instructor: 'Ms. Lisa Thompson',
    totalStudents: 48,
    totalChapters: 9,
    completedChapters: 4,
    lastUpdated: '2024-12-16',
    description: 'Full-stack web development using modern frameworks',
  },
  {
    id: '6',
    name: 'Software Engineering',
    code: 'CS302',
    batchId: '2',
    instructor: 'Prof. David Kim',
    totalStudents: 40,
    totalChapters: 11,
    completedChapters: 7,
    lastUpdated: '2024-12-18',
    description: 'Software development lifecycle and project management',
  },
];

function Content() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedSubject ? (
        <SubjectDetail
          subject={selectedSubject}
          onBack={handleBackToDashboard}
        />
      ) : (
        <Dashboard
          subjects={subjects}
          batches={batches}
          onSubjectSelect={handleSubjectSelect}
        />
      )}
    </div>
  );
}

export default Content;
