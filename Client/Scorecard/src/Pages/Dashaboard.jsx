import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Overview from "../Components/Dashboard/Overview";
import InstituteManagement from "../Components/Dashboard/InstituteManagement";
import Management from "../Components/Dashboard/Management";
import Subscription from "../Components/Dashboard/Subscription";
import Anaylitics from "../Components/Dashboard/Anaylitics";
import Support from "../Components/Dashboard/Support";
import Profile from "../Components/Dashboard/Profile";

const Dashboard = () => {
  const [active, setActive] = useState("overview");

  return (
    <div className="flex">
      {/* Pass both active and setActive */}
      <div className="w-20">
        <Sidebar active={active} setActive={setActive} />
      </div>
      
      <div className="flex-1 p-6">
        {active === "overview" && <Overview />}
        {active === "institute" && <InstituteManagement />}
        {active === "employee" && <Management />}
        {active === "billing" && <Subscription />}
        {active === "analytics" && <Anaylitics />}
        {active === "support" && <Support />}
        {active === "profile" && <Profile />}
        
      </div>
    </div>
  );
};

export default Dashboard;
