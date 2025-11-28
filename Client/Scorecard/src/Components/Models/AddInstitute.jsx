import React, { useState } from "react";
import { enrollInstitute } from "../../Api/Institute"; // <-- Create API function

function AddInstitute({ isOpen, onClose, onSuccess }) {
  const [institute, setInstitute] = useState({
    instituteName: "",
    address: "",
    ownerName: "",
    primaryEmail: "",
    primaryPhoneNumber: "",
    password: "",
  });

  if (!isOpen) return null; // modal hidden if not open

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstitute({
      ...institute,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await enrollInstitute(institute); // API call
      console.log(response);

      if (onSuccess) onSuccess(); // refresh list after add
      onClose(); // close modal after success
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Add New Institute
        </h2>

        {/* Institute Name */}
        <div>
          <label htmlFor="instituteName" className="block text-sm text-gray-600 mb-1">
            Institute Name
          </label>
          <input
            type="text"
            id="instituteName"
            name="instituteName"
            value={institute.instituteName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm text-gray-600 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={institute.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="ownerName" className="block text-sm text-gray-600 mb-1">
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={institute.ownerName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Primary Email */}
        <div>
          <label htmlFor="primaryEmail" className="block text-sm text-gray-600 mb-1">
            Primary Email
          </label>
          <input
            type="email"
            id="primaryEmail"
            name="primaryEmail"
            value={institute.primaryEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Primary Phone Number */}
        <div>
          <label htmlFor="primaryPhoneNumber" className="block text-sm text-gray-600 mb-1">
            Primary Phone Number
          </label>
          <input
            type="tel"
            id="primaryPhoneNumber"
            name="primaryPhoneNumber"
            value={institute.primaryPhoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={institute.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Add Institute
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddInstitute;
