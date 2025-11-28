import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrashAlt, FaPlus } from "react-icons/fa";
import AddUser from "../Models/AddUser";
import { deleteEmployee, employeList, employeeDetails } from "../../Api/Employees.js";

const Management = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // for View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeList();
        if (data?.users) {
          setEmployees(
            data.users.map((user) => ({
              id: user._id,
              name: user.name,
              role: user.role,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);

  // View details
  const viewDetails = async (id) => {
    try {
      const data = await employeeDetails({ id });
      setSelectedEmployee(data.user || null);
      setShowViewModal(true);
    } catch (err) {
      console.error("Failed to fetch employee details", err);
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Delete employee handler (dummy for now)
  const handleDelete = async() => {
    setEmployees(employees.filter((emp) => emp.id !== deleteId));
    const data = await deleteEmployee({ id: deleteId });
    console.log(data);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6 flex-1">
      {/* Search & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-2/3">
          <input
            type="text"
            placeholder="Search Employee"
            className="w-full px-4 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button className="ml-2 p-3 bg-pink-500 rounded-full text-white shadow-md hover:bg-pink-600 transition">
            <FaSearch size={18} />
          </button>
        </div>

        <button 
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition" 
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus size={14}/> New Employee
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Filters */}
        <div className="col-span-1 bg-white shadow-md rounded-2xl p-4">
          <h2 className="font-semibold border-b pb-2">Filters</h2>
        </div>

        {/* Employee List */}
        <div className="col-span-3">
          <h2 className="font-bold text-xl mb-4">Employee List</h2>
          <div className="space-y-3">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-2xl shadow-md flex items-center justify-between px-4 py-3"
                >
                  <span className="font-medium">
                    {emp.name} <span className="text-gray-500">({emp.role})</span>
                  </span>
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => viewDetails(emp.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:bg-gray-200"
                    >
                      <FaEye size={14} /> View
                    </button>
                    <button
                      onClick={() => confirmDelete(emp.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full shadow-sm hover:bg-red-100 text-red-500"
                    >
                      <FaTrashAlt size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No employees found.</p>
            )}
          </div>
        </div>
      </div>

      {/* ======================= VIEW MODAL ======================= */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
            <p><span className="font-bold">Name:</span> {selectedEmployee.name}</p>
            <p><span className="font-bold">Email:</span> {selectedEmployee.email}</p>
            <p><span className="font-bold">Role:</span> {selectedEmployee.role}</p>
            <p><span className="font-bold">Phone Number:</span> {selectedEmployee.phoneNumber}</p>
            <p><span className="font-bold">Username:</span> {selectedEmployee.username}</p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= DELETE MODAL ======================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-80 p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
            <p className="text-gray-600">Are you sure you want to delete this employee?</p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUser 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={() => {
          // refresh employee list after new user
          employeList().then((data) => {
            if (data?.users) {
              setEmployees(data.users.map((u) => ({ id: u._id, name: u.name, role: u.role })));
            }
          });
        }}
      />
    </div>
  );
};

export default Management;
