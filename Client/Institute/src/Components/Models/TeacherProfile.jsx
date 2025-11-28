import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Award,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Download,
  Edit,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Book,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherDetails } from '../../Api/Teacher';

const TeacherProfile = () => {
  const teacherId = useParams();
  const [teacher, setTeacher] = useState();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      const response = await teacherDetails(teacherId);
      setTeacher(response.data);
    };

    fetchTeacherDetails();
  }, []);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'workload', label: 'Workload & Timetable', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'attendance', label: 'Attendance & Leave', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'contributions', label: 'Contributions', icon: Award },
  ];

  // Mock data - replace with actual API data
  const teacherData = {
    ...teacher,
    totalClasses: 156,
    avgFeedback: 4.2,
    attendancePercent: 94,
    salary: 75000,
    workloadHours: 22,
    maxHours: 28,
    avgResults: 87,
    leaveBalance: 12,
    contractEnd: '2025-08-15',
  };

  const timetable = [
    {
      day: 'Monday',
      slots: ['9:00-10:00 CS101', '11:00-12:00 CS201', '2:00-3:00 CS301'],
    },
    { day: 'Tuesday', slots: ['10:00-11:00 CS102', '1:00-2:00 CS202'] },
    { day: 'Wednesday', slots: ['9:00-10:00 CS101', '3:00-4:00 CS303'] },
    { day: 'Thursday', slots: ['11:00-12:00 CS201', '2:00-3:00 CS301'] },
    { day: 'Friday', slots: ['10:00-11:00 CS102', '1:00-2:00 CS202'] },
  ];

  const feedbackData = [
    { month: 'Jan', rating: 4.1 },
    { month: 'Feb', rating: 4.0 },
    { month: 'Mar', rating: 4.3 },
    { month: 'Apr', rating: 4.2 },
    { month: 'May', rating: 4.4 },
    { month: 'Jun', rating: 4.2 },
  ];

  const contributions = [
    {
      type: 'Assignment',
      title: 'Data Structures Assignment 3',
      date: '2024-01-15',
    },
    { type: 'Exam Paper', title: 'Mid-term CS201', date: '2024-01-10' },
    {
      type: 'Research',
      title: 'Machine Learning in Education',
      date: '2024-01-05',
    },
    { type: 'Workshop', title: 'AI Teaching Methods', date: '2023-12-20' },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
        <div className="flex items-start gap-8">
          <img
            src={`${API_URL}/teacherImages/${teacherData.imagePath}`}
            alt={teacherData.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {teacherData.name}
              </h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="font-semibold text-gray-700">ID:</span>{' '}
                <span className="text-gray-900">{teacherData.teacherId}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Department:</span>{' '}
                <span className="text-gray-900">{teacherData.department}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Subjects:</span>{' '}
                <span className="text-gray-900">
                  {teacherData.subjects?.join(', ')}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Join Date:</span>{' '}
                <span className="text-gray-900">
                  {new Date(teacherData.joiningDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <User className="text-blue-600" size={24} />
          <span>Contact Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <Phone className="text-gray-400" size={20} />
            <span className="text-gray-900">{teacherData.phoneNumber}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="text-gray-400" size={20} />
            <span className="text-gray-900">{teacherData.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="text-gray-400" size={20} />
            <span className="text-gray-900">{teacherData.address}</span>
          </div>
          <div className="flex items-center space-x-4">
            <GraduationCap className="text-gray-400" size={20} />
            <span className="text-gray-900">{teacherData.qualification}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {teacherData.totalClasses}
          </div>
          <div className="text-sm text-gray-600">Total Classes</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {teacherData.avgFeedback}/5
          </div>
          <div className="text-sm text-gray-600">Avg. Feedback</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {teacherData.attendancePercent}%
          </div>
          <div className="text-sm text-gray-600">Attendance</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${teacherData.salary.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Monthly Salary</div>
        </div>
      </div>
    </div>
  );

  const renderWorkload = () => (
    <div className="space-y-8">
      {/* Workload Meter */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Weekly Workload</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium">Hours Filled</span>
              <span className="font-bold">
                {teacherData.workloadHours}/{teacherData.maxHours} hrs
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${(teacherData.workloadHours / teacherData.maxHours) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-600">
            {Math.round(
              (teacherData.workloadHours / teacherData.maxHours) * 100
            )}
            %
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Weekly Timetable</h3>
        <div className="space-y-4">
          {timetable.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-2xl p-6">
              <div className="font-bold text-gray-900 mb-4 text-lg">
                {day.day}
              </div>
              <div className="flex flex-wrap gap-3">
                {day.slots.map((slot, slotIndex) => (
                  <span
                    key={slotIndex}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-medium"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Classes */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Assigned Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'CS101 - Programming Basics',
            'CS201 - Data Structures',
            'CS301 - Algorithms',
            'CS202 - Database Systems',
          ].map((className, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl"
            >
              <span className="font-medium">{className}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                45 students
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-green-600 mb-3">
            {teacherData.avgResults}%
          </div>
          <div className="text-gray-600 font-medium">Avg. Student Results</div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-3">
            {teacherData.avgFeedback}/5
          </div>
          <div className="text-gray-600 font-medium">Student Feedback</div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-3">A+</div>
          <div className="text-gray-600 font-medium">Performance Grade</div>
        </div>
      </div>

      {/* Feedback Trend */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Feedback Trend</h3>
        <div className="flex items-end justify-between h-48 gap-4">
          {feedbackData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-2xl transition-all duration-500"
                style={{ height: `${(data.rating / 5) * 100}%` }}
              ></div>
              <div className="text-sm mt-3 text-gray-600 font-medium">
                {data.month}
              </div>
              <div className="text-sm font-bold">{data.rating}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Trophy className="text-yellow-500" size={24} />
          <span>Recent Achievements</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-2xl">
            <Trophy className="text-yellow-500" size={24} />
            <div>
              <div className="font-bold text-gray-900">
                Best Teacher Award 2024
              </div>
              <div className="text-sm text-gray-600">
                Recognized for outstanding performance
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <div className="font-bold text-gray-900">100% Pass Rate</div>
              <div className="text-sm text-gray-600">
                All students passed in CS201
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-8">
      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-green-600 mb-3">
            {teacherData.attendancePercent}%
          </div>
          <div className="text-gray-600 font-medium">Overall Attendance</div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-3">
            {teacherData.leaveBalance}
          </div>
          <div className="text-gray-600 font-medium">Leave Balance</div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-orange-600 mb-3">2</div>
          <div className="text-gray-600 font-medium">This Month Leaves</div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">January 2024 Attendance</h3>
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
                [5, 12, 19].includes(date)
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

      {/* Leave History */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Recent Leave History</h3>
        <div className="space-y-4">
          {[
            {
              date: '2024-01-15',
              type: 'Sick Leave',
              status: 'Approved',
              days: 2,
            },
            {
              date: '2024-01-08',
              type: 'Personal Leave',
              status: 'Approved',
              days: 1,
            },
            {
              date: '2023-12-22',
              type: 'Vacation',
              status: 'Approved',
              days: 5,
            },
          ].map((leave, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl"
            >
              <div>
                <div className="font-bold text-gray-900">{leave.type}</div>
                <div className="text-sm text-gray-600">
                  {leave.date} • {leave.days} day(s)
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-xl text-sm font-medium">
                {leave.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-8">
      {/* Salary Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Current Salary Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${teacherData.salary.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Monthly Salary
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$5,000</div>
            <div className="text-sm text-gray-600 font-medium">Allowances</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">$8,000</div>
            <div className="text-sm text-gray-600 font-medium">Deductions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              $72,000
            </div>
            <div className="text-sm text-gray-600 font-medium">Net Salary</div>
          </div>
        </div>
      </div>

      {/* Recent Payslips */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Recent Payslips</h3>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Download size={18} />
            <span>Download All</span>
          </button>
        </div>
        <div className="space-y-4">
          {['January 2024', 'December 2023', 'November 2023'].map(
            (month, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl"
              >
                <div>
                  <div className="font-bold text-gray-900">{month}</div>
                  <div className="text-sm text-gray-600">Net: $72,000</div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Contract Details */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Contract Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 font-medium">
              Contract Type
            </div>
            <div className="font-bold text-gray-900">Full-time Permanent</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium">
              Contract End Date
            </div>
            <div className="font-bold text-gray-900">
              {new Date(teacherData.contractEnd).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium">
              Probation Period
            </div>
            <div className="font-bold text-gray-900">Completed</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium">Next Review</div>
            <div className="font-bold text-gray-900">August 2024</div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl flex items-center space-x-3">
          <AlertTriangle className="text-yellow-500" size={20} />
          <span className="text-sm font-medium">
            Contract renewal due in 6 months
          </span>
        </div>
      </div>
    </div>
  );

  const renderContributions = () => (
    <div className="space-y-8">
      {/* Contribution Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
          <div className="text-sm text-gray-600 font-medium">Assignments</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">12</div>
          <div className="text-sm text-gray-600 font-medium">Exam Papers</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
          <div className="text-sm text-gray-600 font-medium">
            Research Papers
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
          <div className="text-sm text-gray-600 font-medium">Workshops</div>
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Recent Contributions</h3>
        <div className="space-y-4">
          {contributions.map((contribution, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-2xl ${
                    contribution.type === 'Assignment'
                      ? 'bg-blue-100 text-blue-600'
                      : contribution.type === 'Exam Paper'
                        ? 'bg-green-100 text-green-600'
                        : contribution.type === 'Research'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  <Book size={18} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {contribution.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {contribution.type} • {contribution.date}
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Research & Publications */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Research & Publications</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Machine Learning in Educational Assessment',
              journal: 'Journal of Educational Technology',
              year: '2024',
            },
            {
              title: 'Adaptive Learning Systems',
              journal: 'Computer Science Education',
              year: '2023',
            },
            {
              title: 'Data Structures Teaching Methodologies',
              journal: 'ACM Computing Education',
              year: '2023',
            },
          ].map((publication, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-2xl">
              <div className="font-bold text-gray-900">{publication.title}</div>
              <div className="text-sm text-gray-600 mt-1">
                {publication.journal} • {publication.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'workload':
        return renderWorkload();
      case 'performance':
        return renderPerformance();
      case 'attendance':
        return renderAttendance();
      case 'payroll':
        return renderPayroll();
      case 'contributions':
        return renderContributions();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Teacher Profile
              </h1>
              <p className="text-gray-600">
                Complete profile overview for {teacherData.name}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-between items-center space-x-1 mb-5 bg-white rounded-3xl p-2 shadow-lg border border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-1 rounded-2xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
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

export default TeacherProfile;
