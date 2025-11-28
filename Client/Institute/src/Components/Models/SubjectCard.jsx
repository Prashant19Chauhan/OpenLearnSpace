import React from 'react';
import { User, Users, Calendar, BookOpen, TrendingUp } from 'lucide-react';

const SubjectCard = ({ subject, onClick }) => {
  const completionPercentage = Math.round(
    (subject.completedChapters / subject.totalChapters) * 100
  );

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {subject.name}
          </h3>
          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
            {subject.code}
          </p>
        </div>
        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
          <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {subject.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{subject.instructor}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {subject.totalStudents} students
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {subject.totalChapters} chapters
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(subject.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Course Progress
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {completionPercentage}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{subject.completedChapters} completed</span>
          <span>
            {subject.totalChapters - subject.completedChapters} remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
