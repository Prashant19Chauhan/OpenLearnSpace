import React, { useEffect, useState } from 'react';
import {
  Edit,
  Users,
  Calendar,
  TrendingUp,
  BookOpen,
  DollarSign,
  Award,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { StudentDetails } from '../../Api/Student';

const StudentProfile = () => {
  const studentId = useParams();
  const API_URL = 'http://localhost:5000';
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await StudentDetails(studentId);
        setStudent(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudentDetails();
  }, []);

  const [student, setStudent] = useState({});

  const onBack = () => {
    window.history.back();
  };

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Student Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
        <div className="flex items-start gap-8">
          <img
            src={`${API_URL}/studentsImages/${student.imagePath}`}
            alt={student.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {student.name}
              </h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Edit className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Student ID:</span>{' '}
                <span className="text-gray-900">{student.studentId}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Class:</span>{' '}
                <span className="text-gray-900">
                  {student.class} - Section {student.section}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span>{' '}
                <span className="text-gray-900">{student.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Phone:</span>{' '}
                <span className="text-gray-900">{student.phone}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Admission Date:
                </span>{' '}
                <span className="text-gray-900">{student.admissionDate}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>{' '}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {student.currentGPA}
          </div>
          <div className="text-sm text-gray-600">Current GPA</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {student.attendance}%
          </div>
          <div className="text-sm text-gray-600">Attendance</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {student.totalCredits}
          </div>
          <div className="text-sm text-gray-600">Total Credits</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {student.achievements?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Achievements</div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Users className="text-green-600" size={24} />
          <span>Parent/Guardian Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg font-semibold text-gray-900">
              {student.parentName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Relation
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {student.relation}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="text-lg font-semibold text-gray-900">
              {student.parentPhoneNumber}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg font-semibold text-gray-900">
              {student.parentEmail}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Occupation
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {student.occupation}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Emergency Contact
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {student.emergencyContact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAcademics = () => (
    <div className="space-y-8">
      {/* Subject Performance */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Subject Performance</h3>
        <div className="space-y-4">
          {student.subjects?.map((subject, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {subject.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Teacher: {subject.teacher}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {subject.marks}%
                </div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    subject.grade === 'A'
                      ? 'bg-green-100 text-green-700'
                      : subject.grade.startsWith('A')
                        ? 'bg-green-100 text-green-700'
                        : subject.grade.startsWith('B')
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                  }`}
                >
                  Grade {subject.grade}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Overall Performance
          </h4>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {student.currentGPA}/4.0
          </div>
          <div className="text-sm text-gray-600">Current GPA</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Credits Earned</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {student.totalCredits}
          </div>
          <div className="text-sm text-gray-600">Total Credits</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Class Rank</h4>
          <div className="text-3xl font-bold text-purple-600 mb-2">5th</div>
          <div className="text-sm text-gray-600">Out of 45 students</div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-8">
      {/* GPA Trend */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">GPA Trend</h3>
        <div className="flex items-end justify-between h-48 gap-4">
          {student.monthlyGrades?.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-2xl transition-all duration-500"
                style={{ height: `${(data.gpa / 4) * 100}%` }}
              ></div>
              <div className="text-sm mt-3 text-gray-600 font-medium">
                {data.month}
              </div>
              <div className="text-sm font-bold">{data.gpa}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Award className="text-yellow-500" size={24} />
          <span>Achievements & Awards</span>
        </h3>
        <div className="space-y-4">
          {student.achievements?.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-2xl"
            >
              <Award className="text-yellow-500" size={24} />
              <div>
                <div className="font-bold text-gray-900">
                  {achievement.title}
                </div>
                <div className="text-sm text-gray-600">
                  {achievement.type} • {achievement.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFees = () => (
    <div className="space-y-8">
      {/* Fee Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Fee Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${student.totalFee?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Fee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${student.paidAmount?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Paid Amount</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              ${student.pendingAmount?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Pending Amount
            </div>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Payment Progress</span>
            <span>
              {Math.round((student.paidAmount / student.totalFee) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(student.paidAmount / student.totalFee) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Payment History</h3>
        <div className="space-y-4">
          {student.feeHistory?.map((payment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">{payment.method}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{payment.date}</div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-8">
      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-green-600 mb-3">
            {student.attendance}%
          </div>
          <div className="text-gray-600 font-medium">Overall Attendance</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-3">23</div>
          <div className="text-gray-600 font-medium">Days Present</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-red-600 mb-3">2</div>
          <div className="text-gray-600 font-medium">Days Absent</div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">March 2024 Attendance</h3>
        <div className="grid grid-cols-7 gap-3 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-bold text-gray-600 p-3">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className={`p-3 rounded-xl text-sm font-medium ${
                [5, 12].includes(date)
                  ? 'bg-red-100 text-red-600'
                  : [6, 7, 13, 14, 20, 21, 27, 28].includes(date)
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-green-100 text-green-600'
              }`}
            >
              {date}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-8 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded-lg"></div>
            <span className="font-medium">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 rounded-lg"></div>
            <span className="font-medium">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded-lg"></div>
            <span className="font-medium">Weekend</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'academics':
        return renderAcademics();
      case 'performance':
        return renderPerformance();
      case 'fees':
        return renderFees();
      case 'attendance':
        return renderAttendance();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Profile
              </h1>
              <p className="text-gray-600">
                Complete profile overview for {student.name}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mb-8 bg-white rounded-3xl p-2 shadow-lg border border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-8">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default StudentProfile;
