import { useState } from "react";
import Sidebar from "../Components/Sidebar";

// Import all teacher dashboard pages
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [active, setActive] = useState("overview");

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-20">
        <Sidebar active={active} setActive={setActive} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet/>
      </div>
    </div>
  );
};

export default Dashboard;
