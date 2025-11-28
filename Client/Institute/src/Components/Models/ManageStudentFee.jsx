import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  DollarSign,
  Calendar,
  CreditCard,
  Plus,
  User,
} from 'lucide-react';

function ManageStudentFee({ onClose, onFeeUpdated }) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    batch: '',
    tuitionFee: '',
    additionalFees: '',
    dueDate: '',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
  });

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const batches = [
    'Computer Science 2024',
    'Mathematics 2024',
    'Physics 2024',
    'Chemistry 2024',
    'Biology 2024',
    'English Literature 2024',
    'Business Administration 2024',
    'Engineering 2024',
  ];

  const paymentMethods = [
    'Bank Transfer',
    'Cash',
    'Check',
    'Online Payment',
    'Credit Card',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPayment = () => {
    if (newPayment.amount && newPayment.date) {
      setPaymentHistory((prev) => [
        ...prev,
        {
          ...newPayment,
          amount: parseFloat(newPayment.amount),
        },
      ]);
      setNewPayment({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'Bank Transfer',
      });
    }
  };

  const removePayment = (index) => {
    setPaymentHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const tuitionFee = parseFloat(formData.tuitionFee) || 0;
    const additionalFees = parseFloat(formData.additionalFees) || 0;
    const totalFee = tuitionFee + additionalFees;
    const paidAmount = paymentHistory.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const pendingAmount = totalFee - paidAmount;

    return { totalFee, paidAmount, pendingAmount };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const { totalFee, paidAmount, pendingAmount } = calculateTotals();

    const newFee = {
      _id: Date.now().toString(),
      ...formData,
      tuitionFee: parseFloat(formData.tuitionFee) || 0,
      additionalFees: parseFloat(formData.additionalFees) || 0,
      totalFee,
      paidAmount,
      pendingAmount,
      paymentHistory,
      status:
        pendingAmount === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending',
    };

    onFeeUpdated(newFee);
    setIsSubmitting(false);
  };

  const { totalFee, paidAmount, pendingAmount } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <GraduationCap className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Student Fee
              </h2>
              <p className="text-gray-600">
                Add or update student fee information
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User size={20} className="text-green-600" />
              <span>Student Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  placeholder="S001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch/Program
                </label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <DollarSign size={20} className="text-green-600" />
              <span>Fee Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Fee ($)
                </label>
                <input
                  type="number"
                  name="tuitionFee"
                  value={formData.tuitionFee}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Fees ($)
                </label>
                <input
                  type="number"
                  name="additionalFees"
                  value={formData.additionalFees}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Fee Summary */}
            {(formData.tuitionFee || formData.additionalFees) && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fee:</span>
                    <span className="font-semibold">
                      ${totalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="font-semibold text-green-600">
                      ${paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span className="font-semibold text-gray-900">
                      Pending Amount:
                    </span>
                    <span className="text-xl font-bold text-red-600">
                      ${pendingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <CreditCard size={20} className="text-green-600" />
              <span>Payment History</span>
            </h3>

            {/* Add Payment */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3">Add Payment</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <input
                    type="number"
                    name="amount"
                    value={newPayment.amount}
                    onChange={handlePaymentChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    placeholder="Amount"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    name="date"
                    value={newPayment.date}
                    onChange={handlePaymentChange}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                </div>
                <div>
                  <select
                    name="method"
                    value={newPayment.method}
                    onChange={handlePaymentChange}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={addPayment}
                    className="w-full flex items-center justify-center space-x-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment List */}
            {paymentHistory.length > 0 && (
              <div className="space-y-2">
                {paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-green-600">
                        ${payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {payment.date} • {payment.method}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePayment(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || !formData.studentName || !formData.tuitionFee
              }
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <GraduationCap size={18} />
                  <span>Save Student Fee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageStudentFee;
