import React, { useState } from 'react';
import {
  FaChalkboardTeacher, // Teacher
  FaMoneyBillWave, // Finance
  FaUserGraduate, // Student
  FaBookOpen, // Academics
  FaCog, // Settings
  FaSignOutAlt, // Logout
  FaThLarge, // Dashboard
} from 'react-icons/fa';

import Logout from './Models/Logout';
import {
  MdAdminPanelSettings,
  MdLibraryBooks,
  MdMeetingRoom,
} from 'react-icons/md'; // Management + Content
import { FiMessageSquare } from 'react-icons/fi'; // Communication
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Helper: apply active style based on NavLink
  const getButtonClass = ({ isActive }) =>
    `flex items-center justify-center w-12 h-12 rounded-xl mx-auto transition
     ${isActive ? 'bg-purple-500 text-white' : 'hover:bg-gray-100 text-black'}`;

  return (
    <>
      <div className="h-screen w-20 bg-white shadow-md flex flex-col justify-between fixed left-0 top-0">
        {/* Top Section */}
        <div className="flex flex-col items-center gap-4 mt-4 flex-grow overflow-y-auto">
          {/* Dashboard */}
          <NavLink to="/dashboard" end className={getButtonClass}>
            <FaThLarge className="text-xl" />
          </NavLink>

          {/* Teacher */}
          <NavLink to="/dashboard/teacher" className={getButtonClass}>
            <FaChalkboardTeacher className="text-xl" />
          </NavLink>

          {/* Students */}
          <NavLink to="/dashboard/student" className={getButtonClass}>
            <FaUserGraduate className="text-xl" />
          </NavLink>

          {/* Finance */}
          <NavLink to="/dashboard/finance" className={getButtonClass}>
            <FaMoneyBillWave className="text-xl" />
          </NavLink>

          {/* Content & Exam */}
          <NavLink to="/dashboard/content" className={getButtonClass}>
            <MdLibraryBooks className="text-xl" />
          </NavLink>

          {/* Communication */}
          <NavLink to="/dashboard/communication" className={getButtonClass}>
            <FiMessageSquare className="text-xl" />
          </NavLink>

          {/* Academics */}
          <NavLink to="/dashboard/academics" className={getButtonClass}>
            <FaBookOpen className="text-xl" />
          </NavLink>

          {/* Management */}
          <NavLink to="/dashboard/management" className={getButtonClass}>
            <MdAdminPanelSettings className="text-xl" />
          </NavLink>

          {/* Infrastructures */}
          <NavLink to="/dashboard/examination" className={getButtonClass}>
            <MdMeetingRoom className="text-xl" />
          </NavLink>

          {/* Settings */}
          <NavLink to="/dashboard/profile" className={getButtonClass}>
            <FaCog className="text-xl" />
          </NavLink>
        </div>

        {/* Logout at bottom */}
        <div className="mb-4 mt-2">
          <button
            className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-xl mx-auto"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-black text-xl" />
          </button>
        </div>
      </div>

      {showLogoutModal && <Logout onCancel={() => setShowLogoutModal(false)} />}
    </>
  );
};

export default Sidebar;
