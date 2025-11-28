import React, { useState, useMemo } from 'react';
import { Search, Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import SubjectCard from '../Models/SubjectCard';

const ContentDashboard = ({ subjects, batches, onSubjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBatch =
        selectedBatch === 'all' || subject.batchId === selectedBatch;
      return matchesSearch && matchesBatch;
    });
  }, [subjects, searchTerm, selectedBatch]);

  const groupedSubjects = useMemo(() => {
    const groups = {};
    filteredSubjects.forEach((subject) => {
      const batch = batches.find((b) => b.id === subject.batchId);
      const batchName = batch ? batch.name : 'Unknown Batch';
      if (!groups[batchName]) {
        groups[batchName] = [];
      }
      groups[batchName].push(subject);
    });
    return groups;
  }, [filteredSubjects, batches]);

  const totalStats = useMemo(() => {
    const totalSubjects = subjects.length;
    const totalStudents = subjects.reduce(
      (sum, subject) => sum + subject.totalStudents,
      0
    );
    const totalChapters = subjects.reduce(
      (sum, subject) => sum + subject.totalChapters,
      0
    );
    const completedChapters = subjects.reduce(
      (sum, subject) => sum + subject.completedChapters,
      0
    );
    const completionRate =
      totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0;

    return {
      totalSubjects,
      totalStudents,
      completionRate,
      totalBatches: batches.length,
    };
  }, [subjects, batches]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Institute CMS
              </h1>
              <p className="text-gray-600 mt-1">Content Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Subjects
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalStats.totalSubjects}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalStats.totalStudents}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Batches
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalStats.totalBatches}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalStats.completionRate}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subjects, codes, or instructors..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="all">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subjects by Batch */}
        <div className="space-y-8">
          {Object.entries(groupedSubjects).map(([batchName, batchSubjects]) => (
            <div key={batchName}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {batchName}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {batchSubjects.length} subjects
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batchSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onClick={() => onSubjectSelect(subject)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDashboard;
