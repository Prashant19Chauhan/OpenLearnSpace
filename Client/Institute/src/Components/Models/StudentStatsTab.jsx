import React from 'react';
import {
  TrendingUp,
  Users,
  Award,
  Clock,
  BookOpen,
  Target,
} from 'lucide-react';

const StudentStatsTab = ({ subjectId }) => {
  // Mock student data
  const students = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      rollNumber: 'CS001',
      attendance: 95,
      completedChapters: 10,
      totalChapters: 12,
      lastActivity: '2024-12-19',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      rollNumber: 'CS002',
      attendance: 88,
      completedChapters: 8,
      totalChapters: 12,
      lastActivity: '2024-12-18',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      rollNumber: 'CS003',
      attendance: 92,
      completedChapters: 11,
      totalChapters: 12,
      lastActivity: '2024-12-19',
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      rollNumber: 'CS004',
      attendance: 78,
      completedChapters: 6,
      totalChapters: 12,
      lastActivity: '2024-12-17',
    },
    {
      id: '5',
      name: 'Eva Brown',
      email: 'eva@example.com',
      rollNumber: 'CS005',
      attendance: 85,
      completedChapters: 9,
      totalChapters: 12,
      lastActivity: '2024-12-18',
    },
  ];

  const classStats = {
    averageAttendance: Math.round(
      students.reduce((sum, s) => sum + s.attendance, 0) / students.length
    ),
    averageProgress: Math.round(
      students.reduce(
        (sum, s) => sum + (s.completedChapters / s.totalChapters) * 100,
        0
      ) / students.length
    ),
    totalStudents: students.length,
    activeToday: students.filter((s) => s.lastActivity === '2024-12-19').length,
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceText = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Statistics</h2>
        <p className="text-gray-600 mt-1">
          Track student progress and performance
        </p>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Students
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {classStats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg Attendance
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {classStats.averageAttendance}%
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {classStats.averageProgress}%
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {classStats.activeToday}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Individual Student Performance
          </h3>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Roll Number
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Attendance
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Progress
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Performance
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const progressPercentage = Math.round(
                    (student.completedChapters / student.totalChapters) * 100
                  );
                  const overallPerformance = Math.round(
                    (student.attendance + progressPercentage) / 2
                  );

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">
                          {student.rollNumber}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">
                            {student.attendance}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">
                            {progressPercentage}%
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {student.completedChapters}/{student.totalChapters}{' '}
                            chapters
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(overallPerformance)}`}
                        >
                          {getPerformanceText(overallPerformance)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-gray-600">
                          {new Date(student.lastActivity).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Distribution
          </h3>
          <div className="space-y-3">
            {[
              { range: '90-100%', count: 2, color: 'bg-green-500' },
              { range: '80-89%', count: 2, color: 'bg-blue-500' },
              { range: '70-79%', count: 1, color: 'bg-yellow-500' },
              { range: 'Below 70%', count: 0, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.range}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.count} students
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progress Distribution
          </h3>
          <div className="space-y-3">
            {[
              { range: '90-100%', count: 1, color: 'bg-green-500' },
              { range: '80-89%', count: 2, color: 'bg-blue-500' },
              { range: '70-79%', count: 1, color: 'bg-yellow-500' },
              { range: 'Below 70%', count: 1, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.range}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.count} students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStatsTab;
