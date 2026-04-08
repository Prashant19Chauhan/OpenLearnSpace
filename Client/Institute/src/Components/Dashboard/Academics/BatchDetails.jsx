import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  Award,
  User,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBatchDetails, subjectList } from '../../../Api/Academics';
import AddSubject from '../../Models/AddSubject';

// Mock data
const mockStudents = [
  {
    id: 'STU001',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1 (555) 123-4567',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    grade: 'A',
    attendance: 95,
  },
  {
    id: 'STU002',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1 (555) 234-5678',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    grade: 'B+',
    attendance: 88,
  },
  {
    id: 'STU003',
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phone: '+1 (555) 345-6789',
    enrollmentDate: '2024-01-16',
    status: 'Active',
    grade: 'A-',
    attendance: 92,
  },
  {
    id: 'STU004',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1 (555) 456-7890',
    enrollmentDate: '2024-01-17',
    status: 'Inactive',
    grade: 'C+',
    attendance: 75,
  },
  {
    id: 'STU005',
    name: 'Emma Brown',
    email: 'emma.brown@email.com',
    phone: '+1 (555) 567-8901',
    enrollmentDate: '2024-01-18',
    status: 'Active',
    grade: 'A',
    attendance: 97,
  },
];

const mockTeachers = [
  {
    id: 'TCH001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@institute.edu',
    phone: '+1 (555) 111-2222',
    department: 'Computer Science',
    specialization: 'Software Engineering',
    experience: '8 years',
    rating: 4.8,
    subjects: ['Data Structures', 'Algorithms', 'Software Engineering'],
  },
  {
    id: 'TCH002',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@institute.edu',
    phone: '+1 (555) 222-3333',
    department: 'Computer Science',
    specialization: 'Database Systems',
    experience: '12 years',
    rating: 4.6,
    subjects: ['Database Management', 'Data Mining'],
  },
  {
    id: 'TCH003',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@institute.edu',
    phone: '+1 (555) 333-4444',
    department: 'Computer Science',
    specialization: 'Machine Learning',
    experience: '6 years',
    rating: 4.9,
    subjects: ['Machine Learning', 'Artificial Intelligence'],
  },
]; 

const BatchDetail = () => {
  const batchId = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [batch, setBatchDetails] = useState(null);
  const [addSubjectPopup, setSubjectPopup] = useState(false);
  const [mockSubjects, setSubjects] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const response = await getBatchDetails(
          batchId.programId,
          batchId.batchId
        );
        setBatchDetails(response.data);
      } catch (error) {
        console.log(error);
      }

      try{
        const response = await subjectList(batchId.batchId, batchId.programId);
        setSubjects(response.data);
      }catch(err){
        console.log(err)
      }
    })();
  }, [batchId.id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Ongoing':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-emerald-600';
    if (attendance >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      count: mockStudents.length,
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: GraduationCap,
      count: mockTeachers.length,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: Award,
      count: mockSubjects.length,
    },
  ];

  const SubjectPopup = () => {
    setSubjectPopup(true);
  }

  if (!batch)
    return (
      <div className="text-red-500 text-center mt-10">Batch not found</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Batches</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
              <p className="text-gray-600">{batch.program}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Batch Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Batch Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(batch.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(batch.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {batch.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Enrollment</p>
                      <p className="font-medium text-gray-900">
                        {batch.studentsCount}/{batch.maxCapacity}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">{batch.description}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Students</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {
                          mockStudents.filter((s) => s.status === 'Active')
                            .length
                        }
                      </p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Subjects</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {mockSubjects.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Faculty Members</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {mockTeachers.length}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Progress */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(batch.status)}`}
                    >
                      {batch.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Capacity</span>
                    <span className="text-gray-900 font-medium">
                      {Math.round(
                        (batch.studentsCount / batch.maxCapacity) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(batch.studentsCount / batch.maxCapacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Primary Instructor
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {batch.instructor}
                    </p>
                    <p className="text-sm text-gray-500">Lead Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Students ({mockStudents.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-500">{student.id}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}
                      >
                        {student.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Grade</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.grade)}`}
                        >
                          {student.grade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Attendance
                        </span>
                        <span
                          className={`font-medium ${getAttendanceColor(student.attendance)}`}
                        >
                          {student.attendance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Enrolled</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(student.enrollmentDate)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedStudent(
                          expandedStudent === student.id ? null : student.id
                        )
                      }
                      className="w-full mt-4 flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">
                        {expandedStudent === student.id
                          ? 'Less Details'
                          : 'More Details'}
                      </span>
                      {expandedStudent === student.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedStudent === student.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {student.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {student.phone}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Faculty Members ({mockTeachers.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <GraduationCap className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {teacher.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {teacher.department}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(teacher.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            ({teacher.rating})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          Specialization
                        </span>
                        <p className="text-sm text-gray-900">
                          {teacher.specialization}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Experience
                        </span>
                        <p className="text-sm text-gray-900">
                          {teacher.experience}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Subjects Teaching
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacher.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedTeacher(
                          expandedTeacher === teacher.id ? null : teacher.id
                        )
                      }
                      className="w-full mt-4 flex items-center justify-center space-x-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 py-2 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">
                        {expandedTeacher === teacher.id
                          ? 'Less Details'
                          : 'Contact Info'}
                      </span>
                      {expandedTeacher === teacher.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedTeacher === teacher.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {teacher.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {teacher.phone}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Subjects ({mockSubjects.length})
              </h3>
              <button 
                className='px-2 py-1 rounded-full text-xs font-medium border'
                onClick={SubjectPopup}
              >
                Add Subject
              </button>
            </div>
            {addSubjectPopup && <AddSubject/>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {subject.subjectName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {subject.subjectCode} • 3 Credits
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subject.status)}`}
                      >
                        {subject.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Instructor
                        </span>
                        <span className="text-sm text-gray-900">
                          {subject.instructor}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Schedule</span>
                        <span className="text-sm text-gray-900">
                          {subject.schedule}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Duration</span>
                        <span className="text-sm text-gray-900">
                          {subject.duration}
                        </span>
                      </div>

                      {subject.status === 'Ongoing' && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">
                              Progress
                            </span>
                            <span className="text-sm text-gray-900">
                              {subject.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {subject.status === 'Completed' && (
                        <div className="flex items-center space-x-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setExpandedSubject(
                          expandedSubject === subject.id ? null : subject.id
                        )
                      }
                      className="w-full mt-4 flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-2 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">
                        {expandedSubject === subject.id
                          ? 'Less Details'
                          : 'Description'}
                      </span>
                      {expandedSubject === subject.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedSubject === subject.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          {subject.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDetail;
