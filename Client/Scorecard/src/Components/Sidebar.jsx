import React, { useState } from "react";
import { 
  FaBook, 
  FaUsers, 
  FaTags, 
  FaChartLine, 
  FaHeadset, 
  FaCog, 
  FaSignOutAlt, 
  FaThLarge 
} from "react-icons/fa";
import Logout from "./Models/Logout";

const Sidebar = ({ active, setActive }) => {
  // Utility function to apply active styles
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const getButtonClass = (name) => {
    return `flex items-center justify-center w-12 h-12 rounded-xl mx-auto transition 
      ${active === name ? "bg-pink-500 text-white" : "hover:bg-gray-100 text-black"}`;
  };

  return (
    <>
    <div className="h-screen w-20 bg-white shadow-md flex flex-col justify-between fixed left-0 top-0">
      <div className="flex flex-col space-y-6 mt-6">
        {/* Dashboard */}
        <button
          onClick={() => setActive("overview")}
          className={getButtonClass("overview")}
        >
          <FaThLarge className="text-xl" />
        </button>

        {/* Institute */}
        <button
          onClick={() => setActive("institute")}
          className={getButtonClass("institute")}
        >
          <FaBook className="text-xl" />
        </button>

        {/* Students */}
        <button
          onClick={() => setActive("employee")}
          className={getButtonClass("employee")}
        >
          <FaUsers className="text-xl" />
        </button>

        {/* Finance */}
        <button
          onClick={() => setActive("billing")}
          className={getButtonClass("billing")}
        >
          <FaTags className="text-xl" />
        </button>

        {/* Analytics */}
        <button
          onClick={() => setActive("analytics")}
          className={getButtonClass("analytics")}
        >
          <FaChartLine className="text-xl" />
        </button>

        {/* Support */}
        <button
          onClick={() => setActive("support")}
          className={getButtonClass("support")}
        >
          <FaHeadset className="text-xl" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setActive("profile")}
          className={getButtonClass("profile")}
        >
          <FaCog className="text-xl" />
        </button>
      </div>

      {/* Logout */}
      <button className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-xl mx-auto mb-6"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="text-black text-xl" />
      </button>
    </div>

    {showLogoutModal && <Logout onCancel={() => setShowLogoutModal(false)} />}
    </>
  );
};

export default Sidebar;
