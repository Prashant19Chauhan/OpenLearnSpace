import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  Trash2,
  Plus,
  Filter,
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
} from 'lucide-react';
import AddEmployee from '../Models/AddEmployee'; // new modal for employees
import { NavLink } from 'react-router-dom';
import { getEmployee } from '../../Api/Employee';

const Management = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployee();
        if (response?.data) {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDept !== 'All') {
      filtered = filtered.filter((e) => e.department === selectedDept);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((e) => e.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDept, selectedStatus, employees]);

  const departments = ['All', ...new Set(employees.map((e) => e.department))];
  const statuses = ['All', 'Active', 'On Leave'];

  const handleDeleteEmployee = (employeeId) => {
    setEmployees((prev) => prev.filter((e) => e._id !== employeeId));
  };

  const EmployeeCard = ({ employee }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={`${API_URL}/employeeImages/${employee.imagePath}`}
              alt={employee.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                employee.access === 'allowed' ? 'bg-green-400' : 'bg-orange-400'
              }`}
            ></div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {employee.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Mail size={14} className="mr-1" /> {employee.email}
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Phone size={14} className="mr-1" /> {employee.phoneNumber}
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Briefcase size={14} className="mr-1" /> {employee.designation},{' '}
              {employee.department}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              employee.access === 'allowed'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {employee.access}
          </span>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <NavLink
              to={`/dashboard/management/employeeDetails/${employee.employeeId}`}
            >
              <button className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100">
                <Eye size={16} />
              </button>
            </NavLink>
            <button
              onClick={() => handleDeleteEmployee(employee._id)}
              className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <Users size={14} className="mr-1" />
          <span className="font-medium">Employee ID:</span>{' '}
          {employee.employeeId}
        </div>
        <div className="flex items-center text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>Joined: {employee.joiningDate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600">Manage and organize staff & employees</p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <NavLink to={'/dashboard/management/addEmployee'}>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg">
              <Plus size={18} />
              <span className="font-medium">Add New Employee</span>
            </button>
          </NavLink>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">
              {employees.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {employees.filter((e) => e.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Departments</p>
            <p className="text-2xl font-bold text-blue-600">
              {new Set(employees.map((e) => e.department)).size}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">On Leave</p>
            <p className="text-2xl font-bold text-orange-600">
              {employees.filter((e) => e.status === 'On Leave').length}
            </p>
          </div>
        </div>

        {/* Filters + List */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="text-purple-600" size={20} />
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Quick Stats
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Filtered:</span>
                    <span className="font-semibold text-purple-600">
                      {filteredEmployees.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee List */}
          <div className="xl:col-span-3">
            <h2 className="font-bold text-2xl text-gray-900 mb-2">
              Employee Directory
            </h2>
            <p className="text-gray-600 mb-6">
              {filteredEmployees.length} of {employees.length} employees
            </p>

            {loading ? (
              <p>Loading employees...</p>
            ) : filteredEmployees.length > 0 ? (
              <div className="space-y-6">
                {filteredEmployees.map((employee) => (
                  <EmployeeCard key={employee._id} employee={employee} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Employees Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
                >
                  <Plus size={18} />
                  <span>Add First Employee</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEmployee
          onClose={() => setShowAddModal(false)}
          onEmployeeAdded={(newEmployee) => {
            setEmployees((prev) => [...prev, newEmployee]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Management;
