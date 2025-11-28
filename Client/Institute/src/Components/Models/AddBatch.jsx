import React, { useState } from 'react';
import { createBatch } from '../../Api/Academics';
import { X, Clock, Plus } from 'lucide-react';

function AddBatch({ onClose, setBatchList, programId }) {
  const [formData, setFormData] = useState({
    name: '',
    program: '',
    startDate: '',
    endDate: '',
    maxCapacity: '',
    instructor: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return `${diffMonths} months`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBatch = {
      name: formData.name,
      program: formData.program,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: calculateDuration(formData.startDate, formData.endDate),
      studentsCount: 0,
      maxCapacity: parseInt(formData.maxCapacity),
      instructor: formData.instructor,
      status: new Date(formData.startDate) > new Date() ? 'Upcoming' : 'Active',
      description: formData.description,
    };

    try {
      const response = await createBatch(programId, newBatch);
      console.log(response);
      if (response.status === 200) {
        setBatchList((prev) => [...prev, newBatch]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Batch
              </h3>
              <p className="text-gray-600 text-sm">
                Add a new batch to your program
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Batch Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="e.g., Computer Science Engineering Batch C"
              />
            </div>

            {/* Program */}
            <div>
              <label
                htmlFor="program"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Program *
              </label>
              <select
                id="program"
                name="program"
                required
                value={formData.program}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Select Program</option>
                <option value="Computer Science Engineering">
                  Computer Science Engineering
                </option>
                <option value="Business Administration">
                  Business Administration
                </option>
                <option value="Data Science">Data Science</option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Information Technology">
                  Information Technology
                </option>
              </select>
            </div>

            {/* Max Capacity */}
            <div>
              <label
                htmlFor="maxCapacity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maximum Capacity *
              </label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                required
                min="1"
                max="100"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="e.g., 50"
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Instructor */}
            <div className="md:col-span-2">
              <label
                htmlFor="instructor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Instructor *
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                required
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="e.g., Dr. Sarah Johnson"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="Brief description of the batch focus and objectives..."
              />
            </div>
          </div>

          {/* Duration Preview */}
          {formData.startDate && formData.endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Duration:{' '}
                  {calculateDuration(formData.startDate, formData.endDate)}
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Create Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBatch;
