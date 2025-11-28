import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
} from 'lucide-react';
import AddStudent from '../Models/AddStudent';
import { NavLink } from 'react-router-dom';
import { StudentList } from '../../Api/Student';

const Student = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState([]);
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await StudentList();
        setStudents(response.data);
      } catch (error) {
        console.log('Error fetching student data:', error);
      }
    };
    fetchStudentData();
  }, []);

  const filteredStudents = () => {
    const matchesSearch = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesSearch.filter((student) => {
      if (filterStatus === 'all') return true;
      return student.status.toLowerCase() === filterStatus.toLowerCase();
    });
  };

  const handleAddStudent = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: Date.now(),
      studentId: `STU${String(students.length + 1).padStart(3, '0')}`,
      class: '10th Grade',
      section: 'A',
      status: 'Active',
      currentGPA: 0,
      totalCredits: 0,
      attendance: 100,
      subjects: [],
      totalFee: 15000,
      paidAmount: 0,
      pendingAmount: 15000,
      feeHistory: [],
      monthlyGrades: [],
      achievements: [],
    };
    setStudents((prev) => [...prev, studentWithId]);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Student Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track student information, performance, and fees
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Student</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:mr-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, ID, or email..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium">Total Students</p>
              <p className="text-3xl font-bold">{students.length}</p>
              <p className="text-blue-200 text-sm mt-1">+5% from last month</p>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-full">
              <Users className="w-8 h-8 text-blue-100" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 font-medium">Active Students</p>
              <p className="text-3xl font-bold">
                {students.filter((s) => s.status === 'Active').length}
              </p>
              <p className="text-green-200 text-sm mt-1">Currently enrolled</p>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-full">
              <GraduationCap className="w-8 h-8 text-green-100" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 font-medium">Avg. Attendance</p>
              <p className="text-3xl font-bold">90%</p>
              <p className="text-yellow-200 text-sm mt-1">This semester</p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-30 rounded-full">
              <Calendar className="w-8 h-8 text-yellow-100" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 font-medium">Avg. GPA</p>
              <p className="text-3xl font-bold">3.7</p>
              <p className="text-purple-200 text-sm mt-1">
                Overall performance
              </p>
            </div>
            <div className="p-3 bg-purple-400 bg-opacity-30 rounded-full">
              <Award className="w-8 h-8 text-purple-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents().map((student) => (
                <tr
                  key={student.studentId}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                        src={`${API_URL}/studentsImages/${student.imagePath}`}
                        alt={student.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.studentId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.class}</div>
                    <div className="text-sm text-gray-500">
                      Section {student.section}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        GPA: {student.currentGPA}
                      </div>
                      <div className="ml-2">
                        {student.currentGPA >= 3.5 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Attendance: {student.attendance}%
                    </div>
                  </td>
                  <td></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : student.status === 'Inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <NavLink to={`/dashboard/student/${student.studentId}`}>
                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50">
                          <Eye className="w-5 h-5" />
                        </button>
                      </NavLink>
                      <button className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-full hover:bg-green-50">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-50">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents().length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No students found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudent
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
};

export default Student;
