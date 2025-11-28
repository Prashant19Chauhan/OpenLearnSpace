import React from 'react';
import { logoutRoute } from '../../Api/Auth.js';

function Logout({ onCancel }) {
  const logoutHandler = async () => {
    try {
      await logoutRoute();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold text-white mb-4">
          Confirm Logout
        </h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex justify-between gap-4">
          <button
            className="w-1/2 py-2 rounded-xl bg-gray-700 text-gray-200 hover:bg-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="w-1/2 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
