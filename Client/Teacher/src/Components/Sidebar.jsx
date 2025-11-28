import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaComments, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt 
} from "react-icons/fa";

const Sidebar = ({ active, setActive }) => {
  // Utility function to apply active styles
  const getButtonClass = (name) => {
    return `flex items-center justify-center w-12 h-12 rounded-xl mx-auto transition 
      ${active === name ? "bg-green-500 text-white" : "hover:bg-gray-100 text-black"}`;
  };

  return (
    <div className="h-screen w-20 bg-white shadow-md flex flex-col justify-between fixed left-0 top-0">
      <div className="flex flex-col space-y-6 mt-6">
        {/* Overview */}
        <button
          onClick={() => setActive("overview")}
          className={getButtonClass("overview")}
        >
          <FaChalkboardTeacher className="text-xl" />
        </button>

        {/* Academics */}
        <button
          onClick={() => setActive("academics")}
          className={getButtonClass("academics")}
        >
          <FaBook className="text-xl" />
        </button>

        {/* Communication */}
        <button
          onClick={() => setActive("communication")}
          className={getButtonClass("communication")}
        >
          <FaComments className="text-xl" />
        </button>

        {/* Salary */}
        <button
          onClick={() => setActive("salary")}
          className={getButtonClass("salary")}
        >
          <FaMoneyBillWave className="text-xl" />
        </button>

        {/* Statistics */}
        <button
          onClick={() => setActive("statistics")}
          className={getButtonClass("statistics")}
        >
          <FaChartBar className="text-xl" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setActive("settings")}
          className={getButtonClass("settings")}
        >
          <FaCog className="text-xl" />
        </button>
      </div>

      {/* Logout */}
      <button className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 rounded-xl mx-auto mb-6">
        <FaSignOutAlt className="text-black text-xl" />
      </button>
    </div>
  );
};

export default Sidebar;
