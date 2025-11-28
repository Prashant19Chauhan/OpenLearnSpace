import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  Lock,
  Plus,
  Filter,
  Users,
  BookOpen,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react';
import AddTeacher from '../Models/AddTeacher';
import { teacherList } from '../../Api/Teacher';
import { NavLink } from 'react-router-dom';

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = 'http://localhost:5000';

  // Fetch teacher list from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teacherList();
        if (response?.data) {
          setTeachers(response.data);
          setFilteredTeachers(response.data);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter teachers based on search and filters
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.subjects?.some((subject) =>
            subject.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(
        (teacher) => teacher.department === selectedDepartment
      );
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(
        (teacher) => teacher.access === selectedStatus
      );
    }

    setFilteredTeachers(filtered);
  }, [searchTerm, selectedDepartment, selectedStatus, teachers]);

  const departments = ['All', ...new Set(teachers.map((t) => t.department))];
  const statuses = ['All', 'allowed', 'not allowed'];

  const handleAccessChange = async (teacherId) => {
    console.log(teacherId);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TeacherCard = ({ teacher }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={`${API_URL}/teacherImages/${teacher.imagePath}`}
              alt={teacher.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-purple-200 transition-colors"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                teacher.access === 'allowed' ? 'bg-green-400' : 'bg-orange-400'
              }`}
            ></div>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
              {teacher.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <Mail size={14} />
              <span>{teacher.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <Phone size={14} />
              <span>{teacher.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <MapPin size={14} />
              <span>{teacher.department}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              teacher.access === 'allowed'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {teacher.access}
          </span>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <NavLink to={`/dashboard/teacher/${teacher.teacherId}`}>
              <button className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors">
                <Eye size={16} />
              </button>
            </NavLink>
            <button
              onClick={() => handleAccessChange(teacher._id)}
              className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
            >
              <Lock size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <BookOpen size={14} />
            <span className="font-medium">Subjects:</span>
            <span>{teacher.subjects?.join(', ') || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar size={14} />
            <span>{teacher.experience} years</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Teacher Management
          </h1>
          <p className="text-gray-600">
            Manage and organize your teaching staff
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, subject, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span className="font-medium">Add New Teacher</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Teachers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {teachers.filter((t) => t.access === 'allowed').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Departments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(teachers.map((t) => t.department)).size}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">On Leave</p>
                <p className="text-2xl font-bold text-orange-600">
                  {teachers.filter((t) => t.status === 'On Leave').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="text-purple-600" size={20} />
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Quick Stats
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Filtered Results:</span>
                      <span className="font-semibold text-purple-600">
                        {filteredTeachers.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher List */}
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-2xl text-gray-900">
                  Teacher Directory
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredTeachers.length} of {teachers.length} teachers
                </p>
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : filteredTeachers.length > 0 ? (
              <div className="space-y-6">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Teachers Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ||
                  selectedDepartment !== 'All' ||
                  selectedStatus !== 'All'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Get started by adding your first teacher to the system.'}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add First Teacher</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <AddTeacher
          onClose={() => setShowAddModal(false)}
          onTeacherAdded={(newTeacher) => {
            setTeachers((prev) => [...prev, newTeacher]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Teacher;
