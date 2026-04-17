import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Attendance from "./modals/attandance";
import Assignment from "./modals/Assignment";
import ContentTab from "./modals/contentTab";
import Performance from "./modals/Performance";
import AIMentor from "./modals/AIMentor";
//import { getStudentSubjectData } from "../Api/subject";

// Icons
const icons = {
  attendance: "📅",
  performance: "📊",
  assignment: "📝",
  content: "📚",
  aiMentor: "🤖",
};

function SubjectDetails() {
  const { batchId, subjectId } = useParams();

  const [activeTab, setActiveTab] = useState("attendance");
  const [loading, setLoading] = useState(true);

  const getStudentData = async () => {
    try {
      setLoading(true);
      //const response = await getStudentSubjectData(batchId, subjectId);
      //setData(response.data);
    } catch (error) {
      console.error("Error fetching student subject data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentData();
  }, [batchId, subjectId]);

  const tabs = [
    { id: "attendance", label: "Attendance" },
    { id: "performance", label: "Performance" },
    { id: "assignment", label: "Assignment" },
    { id: "content", label: "Content" },
    { id: "aiMentor", label: "AI Mentor" },
  ];

  const renderTab = () => {
    if (loading)
      return (
        <div className="p-10 text-center text-gray-500">
          Loading data...
        </div>
      );

    switch (activeTab) {
      case "attendance":
        return <Attendance />;

      case "performance":
        return <Performance />;

      case "assignment":
        return (
          <Assignment batchId={batchId} subjectId={subjectId}/>
        );

      case "content":
        return <ContentTab subjectId={subjectId}/>;

      case "aiMentor":
        return <AIMentor subjectId={subjectId} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Subject Dashboard
            </h1>

            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">
                Batch ID: {batchId}
              </span>

              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
                Subject ID: {subjectId}
              </span>
            </p>
          </div>

          <button
            onClick={getStudentData}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 shadow-sm text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto">
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

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
          <div className="p-1">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;