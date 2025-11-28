import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from 'lucide-react';

const AttendanceTab = ({ subjectId }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Mock attendance data
  const students = [
    { id: '1', name: 'Alice Johnson', rollNumber: 'CS001', present: true },
    { id: '2', name: 'Bob Smith', rollNumber: 'CS002', present: true },
    { id: '3', name: 'Carol Davis', rollNumber: 'CS003', present: false },
    { id: '4', name: 'David Wilson', rollNumber: 'CS004', present: true },
    { id: '5', name: 'Eva Brown', rollNumber: 'CS005', present: false },
    { id: '6', name: 'Frank Miller', rollNumber: 'CS006', present: true },
  ];

  const attendanceStats = {
    totalStudents: students.length,
    presentCount: students.filter((s) => s.present).length,
    absentCount: students.filter((s) => !s.present).length,
    attendancePercentage: Math.round(
      (students.filter((s) => s.present).length / students.length) * 100
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Attendance Management
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Date Selection and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Date Picker */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Select Date</h3>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-500">
              Total Students
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {attendanceStats.totalStudents}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-500">Present</span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {attendanceStats.presentCount}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-500">Absent</span>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {attendanceStats.absentCount}
          </p>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {attendanceStats.attendancePercentage}% attendance rate
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${attendanceStats.attendancePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {student.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {student.rollNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      student.present
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.present ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Present</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Absent</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        student.present
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-800'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        !student.present
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-800'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              <span>Mark All Present</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <XCircle className="w-4 h-4" />
              <span>Mark All Absent</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Clock className="w-4 h-4" />
              <span>Save Attendance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;
