import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Send,
  Edit,
} from 'lucide-react';

function ViewComplaint({ complaint, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(complaint.status);
  const [response, setResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedComplaint = {
      ...complaint,
      status,
      lastUpdated: new Date().toISOString(),
      response: response || complaint.response,
    };

    onStatusUpdate(updatedComplaint);
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <MessageSquare className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Complaint Details
              </h2>
              <p className="text-gray-600">
                Review and manage complaint status
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

        <div className="p-6 space-y-6">
          {/* Complaint Information */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {complaint.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {complaint.description}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}
                >
                  {complaint.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}
                >
                  {complaint.priority} Priority
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="font-medium">Submitted by:</span>
                  <span>{complaint.submittedBy}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span className="font-medium">Submitted on:</span>
                  <span>
                    {new Date(complaint.submittedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AlertTriangle size={16} />
                  <span className="font-medium">Category:</span>
                  <span>{complaint.category}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span className="font-medium">Last updated:</span>
                  <span>
                    {new Date(complaint.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User size={16} />
                <span className="font-medium">Assigned to:</span>
                <span>{complaint.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Edit size={20} className="text-purple-600" />
              <span>Update Status</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response/Notes
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  placeholder="Add your response or notes about this complaint..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Update Status</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timeline/History */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock size={20} className="text-purple-600" />
              <span>Activity Timeline</span>
            </h4>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      Complaint Submitted
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(complaint.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complaint was submitted by {complaint.submittedBy}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      Assigned to Team
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(complaint.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complaint assigned to {complaint.assignedTo}
                  </p>
                </div>
              </div>

              {complaint.status !== 'Pending' && (
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      complaint.status === 'Resolved'
                        ? 'bg-green-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {complaint.status === 'Resolved' ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <Clock size={16} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        Status Updated
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(complaint.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Status changed to {complaint.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewComplaint;
