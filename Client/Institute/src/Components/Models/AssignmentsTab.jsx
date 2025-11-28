import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const AssignmentsTab = ({ subjectId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock assignments data
  const assignments = [
    {
      id: '1',
      title: 'Array Implementation Assignment',
      description:
        'Implement basic array operations including insert, delete, and search functionalities.',
      dueDate: '2024-12-25',
      maxScore: 100,
      submissions: 35,
      totalStudents: 45,
      status: 'published',
    },
    {
      id: '2',
      title: 'Linked List Project',
      description:
        'Create a complete linked list implementation with all CRUD operations.',
      dueDate: '2024-12-30',
      maxScore: 150,
      submissions: 12,
      totalStudents: 45,
      status: 'published',
    },
    {
      id: '3',
      title: 'Tree Traversal Algorithms',
      description:
        'Implement various tree traversal algorithms and analyze their time complexity.',
      dueDate: '2025-01-05',
      maxScore: 120,
      submissions: 0,
      totalStudents: 45,
      status: 'draft',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-gray-600 mt-1">
            Create and manage course assignments
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Assignment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Assignment title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Assignment description and requirements"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Score
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Assignment
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const submissionRate = Math.round(
            (assignment.submissions / assignment.totalStudents) * 100
          );

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}
                    >
                      {getStatusIcon(assignment.status)}
                      <span className="capitalize">{assignment.status}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                </div>
              </div>

              {/* Assignment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Due Date
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    {daysUntilDue > 0 && (
                      <p className="text-xs text-orange-600">
                        {daysUntilDue} days left
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Max Score
                    </p>
                    <p className="text-sm text-gray-500">
                      {assignment.maxScore} points
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Submissions
                    </p>
                    <p className="text-sm text-gray-500">
                      {assignment.submissions} / {assignment.totalStudents}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Completion
                    </p>
                    <p className="text-sm text-gray-500">{submissionRate}%</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Submission Progress</span>
                  <span>{submissionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${submissionRate}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Submissions
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                    Edit Assignment
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                    Download Results
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {assignment.status === 'draft' && (
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                      Publish
                    </button>
                  )}
                  {assignment.status === 'published' && (
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentsTab;
