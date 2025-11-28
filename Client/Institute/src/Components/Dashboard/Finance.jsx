import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  CreditCard,
  Wallet,
  Building,
  GraduationCap,
  UserCheck,
  Receipt,
} from 'lucide-react';
import AddSalaryRecord from '../Models/AddSalaryRecord';
import AddExpense from '../Models/AddExpense';
import ManageStudentFee from '../Models/ManageStudentFee';
import ViewFinanceDetails from '../Models/ViewFinanceDetails';

// Mock API functions
const getFinanceData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    teacherSalaries: [
      {
        _id: '1',
        name: 'Dr. Sarah Johnson',
        employeeId: 'T001',
        department: 'Science',
        baseSalary: 75000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 78000,
        paymentDate: '2024-03-01',
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
      },
      {
        _id: '2',
        name: 'Prof. Michael Chen',
        employeeId: 'T002',
        department: 'Technology',
        baseSalary: 80000,
        allowances: 6000,
        deductions: 2500,
        netSalary: 83500,
        paymentDate: '2024-03-01',
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
      },
    ],
    employeeSalaries: [
      {
        _id: '1',
        name: 'John Smith',
        employeeId: 'E001',
        position: 'Administrative Assistant',
        department: 'Administration',
        baseSalary: 45000,
        allowances: 2000,
        deductions: 1500,
        netSalary: 45500,
        paymentDate: '2024-03-01',
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
      },
      {
        _id: '2',
        name: 'Maria Garcia',
        employeeId: 'E002',
        position: 'Librarian',
        department: 'Library',
        baseSalary: 40000,
        allowances: 1500,
        deductions: 1200,
        netSalary: 40300,
        paymentDate: '2024-03-01',
        status: 'Pending',
        paymentMethod: 'Bank Transfer',
      },
    ],
    expenses: [
      {
        _id: '1',
        category: 'Utilities',
        description: 'Electricity Bill - March 2024',
        amount: 15000,
        date: '2024-03-05',
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
        approvedBy: 'Finance Manager',
      },
      {
        _id: '2',
        category: 'Maintenance',
        description: 'Laboratory Equipment Repair',
        amount: 8500,
        date: '2024-03-03',
        status: 'Pending',
        paymentMethod: 'Cash',
        approvedBy: 'Pending',
      },
    ],
    studentFees: [
      {
        _id: '1',
        studentName: 'Alice Johnson',
        studentId: 'S001',
        batch: 'Computer Science 2024',
        tuitionFee: 50000,
        additionalFees: 5000,
        totalFee: 55000,
        paidAmount: 30000,
        pendingAmount: 25000,
        dueDate: '2024-04-15',
        status: 'Partial',
        paymentHistory: [
          { date: '2024-01-15', amount: 30000, method: 'Bank Transfer' },
        ],
      },
      {
        _id: '2',
        studentName: 'Bob Wilson',
        studentId: 'S002',
        batch: 'Mathematics 2024',
        tuitionFee: 45000,
        additionalFees: 3000,
        totalFee: 48000,
        paidAmount: 48000,
        pendingAmount: 0,
        dueDate: '2024-04-15',
        status: 'Paid',
        paymentHistory: [
          { date: '2024-01-10', amount: 48000, method: 'Online Payment' },
        ],
      },
    ],
  };
};

const Finance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [financeData, setFinanceData] = useState({
    teacherSalaries: [],
    employeeSalaries: [],
    expenses: [],
    studentFees: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAddSalaryModal, setShowAddSalaryModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showManageFeeModal, setShowManageFeeModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [salaryType, setSalaryType] = useState('teacher');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFinanceData();
        setFinanceData(response);
      } catch (error) {
        console.error('Error fetching finance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalTeacherSalaries = financeData.teacherSalaries.reduce(
    (sum, t) => sum + t.netSalary,
    0
  );
  const totalEmployeeSalaries = financeData.employeeSalaries.reduce(
    (sum, e) => sum + e.netSalary,
    0
  );
  const totalExpenses = financeData.expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalStudentFees = financeData.studentFees.reduce(
    (sum, s) => sum + s.totalFee,
    0
  );
  const totalPaidFees = financeData.studentFees.reduce(
    (sum, s) => sum + s.paidAmount,
    0
  );
  const totalPendingFees = financeData.studentFees.reduce(
    (sum, s) => sum + s.pendingAmount,
    0
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalPaidFees.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                $
                {(
                  totalTeacherSalaries +
                  totalEmployeeSalaries +
                  totalExpenses
                ).toLocaleString()}
              </p>
              <p className="text-xs text-red-500 mt-1">+5% from last month</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Fees</p>
              <p className="text-2xl font-bold text-orange-600">
                ${totalPendingFees.toLocaleString()}
              </p>
              <p className="text-xs text-orange-500 mt-1">
                {
                  financeData.studentFees.filter((s) => s.status !== 'Paid')
                    .length
                }{' '}
                students
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Wallet className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">
                $
                {(
                  totalPaidFees -
                  totalTeacherSalaries -
                  totalEmployeeSalaries -
                  totalExpenses
                ).toLocaleString()}
              </p>
              <p className="text-xs text-blue-500 mt-1">Current month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setSalaryType('teacher');
              setShowAddSalaryModal(true);
            }}
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <GraduationCap className="text-purple-600" size={20} />
            <span className="font-medium text-purple-700">
              Add Teacher Salary
            </span>
          </button>
          <button
            onClick={() => {
              setSalaryType('employee');
              setShowAddSalaryModal(true);
            }}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <UserCheck className="text-blue-600" size={20} />
            <span className="font-medium text-blue-700">
              Add Employee Salary
            </span>
          </button>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Receipt className="text-red-600" size={20} />
            <span className="font-medium text-red-700">Add Expense</span>
          </button>
          <button
            onClick={() => setShowManageFeeModal(true)}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <CreditCard className="text-green-600" size={20} />
            <span className="font-medium text-green-700">
              Manage Student Fees
            </span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {[
            ...financeData.teacherSalaries.slice(0, 2),
            ...financeData.expenses.slice(0, 2),
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${item.department ? 'bg-purple-100' : 'bg-red-100'}`}
                >
                  {item.department ? (
                    <GraduationCap className="text-purple-600" size={16} />
                  ) : (
                    <Receipt className="text-red-600" size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {item.name || item.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.department || item.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.netSalary || item.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {item.paymentDate || item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SalaryCard = ({ salary, type }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {type === 'teacher' ? (
              <GraduationCap className="text-purple-600" size={18} />
            ) : (
              <UserCheck className="text-blue-600" size={18} />
            )}
            <h3 className="font-semibold text-lg text-gray-900">
              {salary.name}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-1">ID: {salary.employeeId}</p>
          <p className="text-gray-600 text-sm">
            {salary.department} {salary.position && `• ${salary.position}`}
          </p>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setSelectedRecord({ ...salary, type })}
            className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Eye size={16} />
          </button>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Salary:</span>
          <span className="font-medium">
            ${salary.baseSalary.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Allowances:</span>
          <span className="font-medium text-green-600">
            +${salary.allowances.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deductions:</span>
          <span className="font-medium text-red-600">
            -${salary.deductions.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span className="font-semibold text-gray-900">Net Salary:</span>
          <span className="font-bold text-lg text-purple-600">
            ${salary.netSalary.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(salary.status)}`}
        >
          {salary.status}
        </span>
        <div className="text-sm text-gray-500">
          <Calendar size={14} className="inline mr-1" />
          {salary.paymentDate}
        </div>
      </div>
    </div>
  );

  const ExpenseCard = ({ expense }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Receipt className="text-red-600" size={18} />
            <h3 className="font-semibold text-lg text-gray-900">
              {expense.category}
            </h3>
          </div>
          <p className="text-gray-600 text-sm">{expense.description}</p>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setSelectedRecord({ ...expense, type: 'expense' })}
            className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Eye size={16} />
          </button>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-red-600">
          ${expense.amount.toLocaleString()}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}
        >
          {expense.status}
        </span>
        <div className="text-gray-500">
          <Calendar size={14} className="inline mr-1" />
          {expense.date}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Payment Method:</span>
          <span>{expense.paymentMethod}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Approved By:</span>
          <span>{expense.approvedBy}</span>
        </div>
      </div>
    </div>
  );

  const StudentFeeCard = ({ student }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <GraduationCap className="text-green-600" size={18} />
            <h3 className="font-semibold text-lg text-gray-900">
              {student.studentName}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-1">ID: {student.studentId}</p>
          <p className="text-gray-600 text-sm">{student.batch}</p>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() =>
              setSelectedRecord({ ...student, type: 'studentFee' })
            }
            className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Eye size={16} />
          </button>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
            <Edit size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Fee:</span>
          <span className="font-medium">
            ${student.totalFee.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Paid Amount:</span>
          <span className="font-medium text-green-600">
            ${student.paidAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pending:</span>
          <span className="font-medium text-red-600">
            ${student.pendingAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Payment Progress</span>
          <span>
            {Math.round((student.paidAmount / student.totalFee) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(student.paidAmount / student.totalFee) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}
        >
          {student.status}
        </span>
        <div className="text-sm text-gray-500">Due: {student.dueDate}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finance Management
          </h1>
          <p className="text-gray-600">
            Comprehensive financial management for your institution
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSign },
            {
              id: 'teacher-salary',
              label: 'Teacher Salaries',
              icon: GraduationCap,
            },
            {
              id: 'employee-salary',
              label: 'Employee Salaries',
              icon: UserCheck,
            },
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'student-fees', label: 'Student Fees', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        {activeTab !== 'overview' && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={`Search ${activeTab.replace('-', ' ')}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl hover:bg-gray-200 transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'teacher-salary') {
                    setSalaryType('teacher');
                    setShowAddSalaryModal(true);
                  } else if (activeTab === 'employee-salary') {
                    setSalaryType('employee');
                    setShowAddSalaryModal(true);
                  } else if (activeTab === 'expenses') {
                    setShowAddExpenseModal(true);
                  } else if (activeTab === 'student-fees') {
                    setShowManageFeeModal(true);
                  }
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span className="font-medium">
                  Add{' '}
                  {activeTab === 'teacher-salary'
                    ? 'Teacher Salary'
                    : activeTab === 'employee-salary'
                      ? 'Employee Salary'
                      : activeTab === 'expenses'
                        ? 'Expense'
                        : 'Student Fee'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-8">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab />}

              {activeTab === 'teacher-salary' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {financeData.teacherSalaries.map((salary) => (
                    <SalaryCard
                      key={salary._id}
                      salary={salary}
                      type="teacher"
                    />
                  ))}
                </div>
              )}

              {activeTab === 'employee-salary' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {financeData.employeeSalaries.map((salary) => (
                    <SalaryCard
                      key={salary._id}
                      salary={salary}
                      type="employee"
                    />
                  ))}
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {financeData.expenses.map((expense) => (
                    <ExpenseCard key={expense._id} expense={expense} />
                  ))}
                </div>
              )}

              {activeTab === 'student-fees' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {financeData.studentFees.map((student) => (
                    <StudentFeeCard key={student._id} student={student} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddSalaryModal && (
        <AddSalaryRecord
          type={salaryType}
          onClose={() => setShowAddSalaryModal(false)}
          onSalaryAdded={(newSalary) => {
            if (salaryType === 'teacher') {
              setFinanceData((prev) => ({
                ...prev,
                teacherSalaries: [newSalary, ...prev.teacherSalaries],
              }));
            } else {
              setFinanceData((prev) => ({
                ...prev,
                employeeSalaries: [newSalary, ...prev.employeeSalaries],
              }));
            }
            setShowAddSalaryModal(false);
          }}
        />
      )}

      {showAddExpenseModal && (
        <AddExpense
          onClose={() => setShowAddExpenseModal(false)}
          onExpenseAdded={(newExpense) => {
            setFinanceData((prev) => ({
              ...prev,
              expenses: [newExpense, ...prev.expenses],
            }));
            setShowAddExpenseModal(false);
          }}
        />
      )}

      {showManageFeeModal && (
        <ManageStudentFee
          onClose={() => setShowManageFeeModal(false)}
          onFeeUpdated={(updatedFee) => {
            setFinanceData((prev) => ({
              ...prev,
              studentFees: [updatedFee, ...prev.studentFees],
            }));
            setShowManageFeeModal(false);
          }}
        />
      )}

      {selectedRecord && (
        <ViewFinanceDetails
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
};

export default Finance;
