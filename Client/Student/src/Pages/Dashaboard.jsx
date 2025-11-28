import { useState } from "react";
import Sidebar from "../Components/Sidebar";

// Import student dashboard pages
import Overview from "../Components/Dashboard/Overview";
import Academics from "../Components/Dashboard/Academics";
import Fee from "../Components/Dashboard/Fee";
import Communication from "../Components/Dashboard/Communication";
import Statistics from "../Components/Dashboard/Statistics";
import Settings from "../Components/Dashboard/Profile";

const Dashboard = () => {
  const [active, setActive] = useState("overview");

  const renderContent = () => {
    switch (active) {
      case "overview":
        return <Overview />;
      case "academics":
        return <Academics />;
      case "fee":
        return <Fee />;
      case "communication":
        return <Communication />;
      case "statistics":
        return <Statistics />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-20">
        <Sidebar active={active} setActive={setActive} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
