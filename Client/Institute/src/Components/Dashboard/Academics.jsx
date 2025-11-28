import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  GraduationCap,
  Clock,
  Plus,
} from 'lucide-react';
import AddProgram from '../Models/AddProgram';
import { programList } from '../../Api/Academics';
import { NavLink } from 'react-router-dom';

const mockPrograms = [
  {
    id: 1,
    programName: 'Computer Science & Engineering',
    description:
      'Comprehensive program covering software development, algorithms, and system design with hands-on projects.',
    department: 'Engineering',
    type: 'Undergraduate',
    duration: '4 years',
    enrolled: 245,
    capacity: 280,
    startDate: '2025-10-24T00:00:00.000+00:00',
    fee: '$12,000/year',
    level: 'Bachelor',
  },
];

const typeColors = {
  Undergraduate: 'bg-blue-100 text-blue-800 border-blue-200',
  Graduate: 'bg-green-100 text-green-800 border-green-200',
  Doctorate: 'bg-purple-100 text-purple-800 border-purple-200',
  Certificate: 'bg-orange-100 text-orange-800 border-orange-200',
};

function Academics() {
  useEffect(() => {
    (async () => {
      try {
        const response = await programList();
        setPrograms(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [programs, setPrograms] = useState(mockPrograms);
  const [showAddForm, setShowAddForm] = useState(false);

  const departments = [
    'All',
    ...Array.from(new Set(programs.map((p) => p.department))),
  ];
  const types = [
    'All',
    'Undergraduate',
    'Graduate',
    'Doctorate',
    'Certificate',
  ];
  const levels = ['All', ...Array.from(new Set(programs.map((p) => p.level)))];

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === 'All' || program.type === selectedType;
      const matchesDepartment =
        selectedDepartment === 'All' ||
        program.department === selectedDepartment;
      const matchesLevel =
        selectedLevel === 'All' || program.level === selectedLevel;

      return matchesSearch && matchesType && matchesDepartment && matchesLevel;
    });
  }, [searchTerm, selectedType, selectedDepartment, selectedLevel, programs]);

  const totalEnrolled = programs.reduce(
    (sum, program) => sum + program.enrolled,
    0
  );
  const totalCapacity = programs.reduce(
    (sum, program) => sum + program.capacity,
    0
  );
  const averageEnrollment = Math.round((totalEnrolled / totalCapacity) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Academic Programs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Academic programs designed to prepare you for success.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Programs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {programs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEnrolled.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCapacity.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Enrollment Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageEnrollment}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === 'All' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPrograms.length} of {programs.length} programs
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program, index) => (
            <div
              id={program.programId}
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[program.programType]}`}
                  >
                    {program.programType}
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Enrolled</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {program.enrolled}/{program.capacity}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {program.programName}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {program.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {program.department}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {program.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Starts {program.startDate}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-blue-600">
                    {program.fee}
                  </span>
                  <NavLink
                    to={`/dashboard/academics/program/${program.programId}`}
                  >
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Learn More
                    </button>
                  </NavLink>
                </div>

                {/* Enrollment Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Enrollment Progress</span>
                    <span>
                      {Math.round((program.enrolled / program.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(program.enrolled / program.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No programs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Add Program Modal */}
        {showAddForm && (
          <AddProgram
            onClose={() => setShowAddForm(false)}
            onProgramAdded={(newProgram) => {
              setPrograms((prev) => [...prev, newProgram]);
              setShowAddForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Academics;
