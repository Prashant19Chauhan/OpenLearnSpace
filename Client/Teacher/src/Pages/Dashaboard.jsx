import { useState } from "react";
import Sidebar from "../Components/Sidebar";

// Import all teacher dashboard pages
import Overview from "../Components/Dashboard/Overview";
import Academics from "../Components/Dashboard/Academics";
import Communication from "../Components/Dashboard/Communication";
import Salary from "../Components/Dashboard/Salary";
import Statistics from "../Components/Dashboard/Statistics";
import Settings from "../Components/Dashboard/Profile";

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
        {active === "overview" && <Overview />}
        {active === "academics" && <Academics />}
        {active === "communication" && <Communication />}
        {active === "salary" && <Salary />}
        {active === "statistics" && <Statistics />}
        {active === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
