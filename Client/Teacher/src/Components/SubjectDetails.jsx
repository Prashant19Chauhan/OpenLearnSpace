import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Attendance from "./modals/attandance";
import Assignment from "./modals/Assignment";
import ContentTab from "./modals/contentTab";
import StudentDetailsTab from "./modals/StudentDetailsTab";
import Performance from "./modals/Performance";
import { getBatchStudents } from "../Api/subject";

// Icons (Optional: Replace with Lucide-React or Heroicons if available)
const icons = {
  attendance: "📅",
  performance: "📊",
  assignment: "📝",
  content: "📚",
  student: "🎓",
};

function SubjectDetails() {
  const { batchId, subjectId } = useParams();
  const [activeTab, setActiveTab] = useState("attendance");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStudents = async () => {
    try {
      setLoading(true);
      const response = await getBatchStudents(batchId);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, [batchId]);

  const tabs = [
    { id: "attendance", label: "Attendance" },
    { id: "performance", label: "Performance" },
    { id: "assignment", label: "Assignment" },
    { id: "content", label: "Content" },
    { id: "student", label: "Student List" },
  ];

  const renderTab = () => {
    if (loading) return <div className="p-10 text-center text-gray-500">Loading data...</div>;

    switch (activeTab) {
      case "attendance":
        return <Attendance studentsData={students} />;
      case "performance":
        return <Performance/>;
      case "assignment":
        return <Assignment studentsData={students} batchId={batchId} />;
      case "content":
        return <ContentTab subjectId={subjectId} studentsData={students}/>;
      case "student":
        return <StudentDetailsTab studentsData={students} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Subject Management
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">
                Batch ID: {batchId}
              </span>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">
                Subject ID: {subjectId}
              </span>
              • {students?.students?.length || 0} Students Enrolled
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={getStudents}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all shadow-sm text-sm font-medium"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Modern Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm scale-105"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span>{icons[tab.id]}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[500px]">
          <div className="p-1 transition-opacity duration-300">
             {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;