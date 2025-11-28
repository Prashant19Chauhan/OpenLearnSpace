import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrashAlt, FaPlus } from "react-icons/fa";
import { getAllInstitutes, findInstituteDetails } from "../../Api/Institute";
import AddInstitute from "../Models/AddInstitute";

const InstituteManagement = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const response = await getAllInstitutes();
      if (response?.success && response.data) {
        setInstitutes(response.data);
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (instituteId) => {
    try {
      const response = await findInstituteDetails({ id: instituteId });
      if (response?.success) {
        setSelectedInstitute(response.InstituteDetails);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Error fetching institute details:", error);
    }
  };

  return (
    <div className="p-6 flex-1">
      {/* Search & Actions */}
      <div className="flex items-center justify-between mb-6">
        {/* Search Bar */}
        <div className="flex items-center w-2/3">
          <input
            type="text"
            placeholder="Search Institute"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button className="ml-2 p-3 bg-pink-500 rounded-full text-white shadow-md hover:bg-pink-600 transition">
            <FaSearch size={18} />
          </button>
        </div>

        {/* New Enrollment */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition"
        >
          <FaPlus size={14} /> New Enrollment
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Filters */}
        <div className="col-span-1 bg-white shadow-md rounded-2xl p-4">
          <h2 className="font-semibold border-b pb-2">Filters</h2>
          {/* Add filter options here */}
        </div>

        {/* Institute List */}
        <div className="col-span-3">
          <h2 className="font-bold text-xl mb-4">Institute List</h2>
          {loading ? (
            <div className="text-center py-4">Loading institutes...</div>
          ) : (
          <div className="space-y-3">
              {institutes.length > 0 ? (
                institutes.map((institute) => (
              <div
                    key={institute._id}
                className="bg-white rounded-2xl shadow-md flex items-center justify-between px-4 py-3"
              >
                    <span className="font-medium">{institute.instituteName}</span>
                <div className="space-x-2 flex">
                      <button 
                        onClick={() => handleViewDetails(institute._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:bg-gray-200"
                      >
                    <FaEye size={14} /> View
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:bg-red-100 text-red-500">
                    <FaTrashAlt size={14} /> Delete
                  </button>
                </div>
              </div>
                ))
              ) : (
                <div className="text-center py-4">No institutes found</div>
              )}
          </div>
          )}

          {/* Pagination */}
          {institutes.length > 0 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button className="px-6 py-2 rounded-full bg-gray-100 shadow-sm hover:bg-gray-200">
              Previous
            </button>
            <button className="px-6 py-2 rounded-full bg-pink-500 text-white shadow-md hover:bg-pink-600">
              Next
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Add Institute Modal */}
      {showAddModal && (
        <AddInstitute 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            fetchInstitutes();
          }} 
        />
      )}

      {/* Institute Details Modal */}
      {showDetailsModal && selectedInstitute && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">{selectedInstitute.instituteId}</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Institute Name:</span> {selectedInstitute.instituteName}
              </div>
              <div>
                <span className="font-medium">Address:</span> {selectedInstitute.instituteLocation}
              </div>
              <div>
                <span className="font-medium">Email:</span> {selectedInstitute.primaryEmail}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {selectedInstitute.primaryPhoneNumber}
              </div>
              {selectedInstitute.description && (
                <div>
                  <span className="font-medium">Owner Name:</span> {selectedInstitute.ownerName}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteManagement;
