import React, { useEffect, useState } from 'react';
import { FaSearch, FaEye, FaTrashAlt, FaPlus } from 'react-icons/fa';
import AddSubject from '../../Models/AddSubject';
import { subjectList } from '../../../Api/Academics'; // <-- replace with your subject API
import { useParams } from 'react-router-dom';

const Subject = () => {
  const { programId, batchId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subject list from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectList(programId, batchId); // call API
        if (response?.data) {
          setSubjects(response.data); // set response data to state
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [programId]);

  return (
    <div className="p-6 flex-1">
      {/* Search & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-2/3">
          <input
            type="text"
            placeholder="Search Subject"
            className="w-full px-4 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button className="ml-2 p-3 bg-purple-500 rounded-full text-white shadow-md hover:bg-purple-600 transition">
            <FaSearch size={18} />
          </button>
        </div>

        <button className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-600 transition">
          <FaPlus size={14} /> New Subject
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Filters */}
        <div className="col-span-1 bg-white shadow-md rounded-2xl p-4">
          <h2 className="font-semibold border-b pb-2">Filters</h2>
        </div>

        {/* Subject List */}
        <div className="col-span-3">
          <h2 className="font-bold text-xl mb-4">Subject List</h2>

          {loading ? (
            <p className="text-gray-500">Loading subjects...</p>
          ) : subjects.length > 0 ? (
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div
                  key={subject._id} // assuming MongoDB
                  className="bg-white rounded-2xl shadow-md flex items-center justify-between px-4 py-3"
                >
                  <span className="font-medium">{subject.subjectName}</span>
                  <div className="space-x-2 flex">
                    <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:bg-gray-200">
                      <FaEye size={14} /> View
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:bg-red-100 text-red-500">
                      <FaTrashAlt size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No Subject found.</p>
          )}
        </div>
      </div>

      <AddSubject />
    </div>
  );
};

export default Subject;
