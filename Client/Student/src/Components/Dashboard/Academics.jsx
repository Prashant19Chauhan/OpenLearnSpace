import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getsubejcts } from "../../Api/subject";

const Academics = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSubjects = async () => {
    try {
      setLoading(true);
      const response = await getsubejcts();
      setSubjects(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Academic Overview
        </h1>
        <p className="text-slate-500 mt-2">
          Manage your assigned subjects, track syllabus progress, and view student batches.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium text-lg">No subjects assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="group relative bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Header: Program & Batch */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {subject.programName}
                    </span>
                    <h2 className="text-xl font-bold text-slate-800 mt-2 leading-tight">
                      {subject.subjectName}
                    </h2>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-xl text-lg">📚</div>
                </div>

                {/* Details Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-500">
                    <span className="mr-2">🏷️</span>
                    <span className="font-medium">Batch:</span>
                    <span className="ml-1 text-slate-700">{subject.batchName}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <span className="mr-2">👥</span>
                    <span className="font-medium">Students:</span>
                    <span className="ml-1 text-slate-700">{subject.totalStudents} Enrolled</span>
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="mb-6 bg-slate-50 p-4 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase">Syllabus Progress</span>
                    <span className="text-blue-600">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <NavLink
                  to={`/academics/batch/${subject.batchId}/subject/${subject.subjectCode}`}
                  className="block"
                >
                  <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-[0.98]">
                    View Details
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Academics;