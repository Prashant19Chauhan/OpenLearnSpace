import React from 'react';
import {
  X,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  Receipt,
  GraduationCap,
  Building,
  TrendingUp,
} from 'lucide-react';

function ViewFinanceDetails({ record, onClose }) {
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

  const renderSalaryDetails = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <User size={20} className="text-purple-600" />
          <span>Personal Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg font-semibold text-gray-900">{record.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Employee ID
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.employeeId}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Department
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.department}
            </p>
          </div>
          {record.position && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Position
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {record.position}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="bg-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <DollarSign size={20} className="text-purple-600" />
          <span>Salary Breakdown</span>
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-purple-200">
            <span className="text-gray-600">Base Salary</span>
            <span className="text-lg font-semibold">
              ${record.baseSalary?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-purple-200">
            <span className="text-gray-600">Allowances</span>
            <span className="text-lg font-semibold text-green-600">
              +${record.allowances?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-purple-200">
            <span className="text-gray-600">Deductions</span>
            <span className="text-lg font-semibold text-red-600">
              -${record.deductions?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 bg-purple-100 rounded-xl px-4">
            <span className="text-lg font-bold text-gray-900">Net Salary</span>
            <span className="text-2xl font-bold text-purple-600">
              ${record.netSalary?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <CreditCard size={20} className="text-blue-600" />
          <span>Payment Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Payment Date
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.paymentDate}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Payment Method
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.paymentMethod}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}
            >
              {record.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenseDetails = () => (
    <div className="space-y-6">
      {/* Expense Information */}
      <div className="bg-red-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Receipt size={20} className="text-red-600" />
          <span>Expense Information</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category
            </label>
            <p className="text-xl font-bold text-gray-900">{record.category}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <p className="text-gray-900">{record.description}</p>
          </div>
          <div className="bg-red-100 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Amount
              </span>
              <span className="text-3xl font-bold text-red-600">
                ${record.amount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <CreditCard size={20} className="text-gray-600" />
          <span>Payment Details</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Date</label>
            <p className="text-lg font-semibold text-gray-900">{record.date}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Payment Method
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.paymentMethod}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Approved By
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.approvedBy}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}
            >
              {record.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentFeeDetails = () => (
    <div className="space-y-6">
      {/* Student Information */}
      <div className="bg-green-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <GraduationCap size={20} className="text-green-600" />
          <span>Student Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Student Name
            </label>
            <p className="text-xl font-bold text-gray-900">
              {record.studentName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Student ID
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.studentId}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Batch/Program
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {record.batch}
            </p>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <DollarSign size={20} className="text-blue-600" />
          <span>Fee Breakdown</span>
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-600">Tuition Fee</span>
            <span className="text-lg font-semibold">
              ${record.tuitionFee?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-600">Additional Fees</span>
            <span className="text-lg font-semibold">
              ${record.additionalFees?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-600">Total Fee</span>
            <span className="text-lg font-semibold">
              ${record.totalFee?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-600">Paid Amount</span>
            <span className="text-lg font-semibold text-green-600">
              ${record.paidAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 bg-blue-100 rounded-xl px-4">
            <span className="text-lg font-bold text-gray-900">
              Pending Amount
            </span>
            <span className="text-2xl font-bold text-red-600">
              ${record.pendingAmount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Payment Progress</span>
            <span>
              {Math.round((record.paidAmount / record.totalFee) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(record.paidAmount / record.totalFee) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {record.paymentHistory && record.paymentHistory.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp size={20} className="text-gray-600" />
            <span>Payment History</span>
          </h3>
          <div className="space-y-3">
            {record.paymentHistory.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{payment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                record.type === 'teacher' || record.type === 'employee'
                  ? 'bg-purple-100'
                  : record.type === 'expense'
                    ? 'bg-red-100'
                    : 'bg-green-100'
              }`}
            >
              {record.type === 'teacher' || record.type === 'employee' ? (
                <DollarSign className="text-purple-600" size={24} />
              ) : record.type === 'expense' ? (
                <Receipt className="text-red-600" size={24} />
              ) : (
                <GraduationCap className="text-green-600" size={24} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {record.type === 'teacher'
                  ? 'Teacher Salary Details'
                  : record.type === 'employee'
                    ? 'Employee Salary Details'
                    : record.type === 'expense'
                      ? 'Expense Details'
                      : 'Student Fee Details'}
              </h2>
              <p className="text-gray-600">
                {record.name || record.studentName || record.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="text-gray-500" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {(record.type === 'teacher' || record.type === 'employee') &&
            renderSalaryDetails()}
          {record.type === 'expense' && renderExpenseDetails()}
          {record.type === 'studentFee' && renderStudentFeeDetails()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewFinanceDetails;
