import React, { use, useEffect, useState } from 'react';
import {
  Search,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Filter,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import AddBatch from '../../Models/AddBatch';
import { getBatchList } from '../../../Api/Academics';

const batches = [
  {
    batchId: 'CSE-2024-01',
    name: 'Computer Science Engineering Batch A',
    program: 'Computer Science Engineering',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    duration: '12 months',
    studentsCount: 45,
    maxCapacity: 50,
    instructor: 'Dr. Sarah Johnson',
    status: 'Active',
    description: 'Advanced programming and software development focus',
  },
];

function ProgramDetails() {
  const programId = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchList, setBatchList] = useState(batches);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBatchList(programId.id);
        setBatchList(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [programId.id]);

  const filteredBatches = batchList.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCapacityColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-emerald-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Programs</span>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Program Batches
                </h2>
                <p className="text-gray-600">
                  Manage and view all active, upcoming, and completed batches
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {batchList.filter((b) => b.status === 'Active').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {batchList.filter((b) => b.status === 'Upcoming').length}
                </div>
                <div className="text-sm text-gray-500">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {batchList.filter((b) => b.status === 'Completed').length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-5 w-5" />
                <span>Create Batch</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search batches, programs, or instructors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Batch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <div
              key={batch.batchId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                      {batch.name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm">
                      {batch.program}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(batch.status)}`}
                  >
                    {batch.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {batch.description}
                </p>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Start Date</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(batch.startDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="text-sm font-medium text-gray-900">
                        {batch.duration}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Enrollment</div>
                      <div
                        className={`text-sm font-medium ${getCapacityColor(batch.studentsCount, batch.maxCapacity)}`}
                      >
                        {batch.studentsCount}/{batch.maxCapacity}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Instructor</div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-24">
                        {batch.instructor}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Capacity</span>
                    <span className="text-xs text-gray-500">
                      {Math.round(
                        (batch.studentsCount / batch.maxCapacity) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(batch.studentsCount / batch.maxCapacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Batch ID: {batch.id}
                  </span>
                  <NavLink
                    to={`/dashboard/academics/program/${programId.id}/batch/${batch.batchId}`}
                  >
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200">
                      View Details
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBatches.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No batches found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </main>
      {isModalOpen && (
        <AddBatch
          onClose={() => setIsModalOpen(false)}
          setBatchList={setBatchList}
          programId={programId}
        />
      )}
    </div>
  );
}

export default ProgramDetails;
