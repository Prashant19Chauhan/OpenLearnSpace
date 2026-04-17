import React, { useEffect, useState } from "react";
import { getAssignments, getAssignmentReport } from "../../Api/subject";
import {useSelector} from "react-redux";

function Assignment({ batchId, subjectId }) {
  const { user } = useSelector((state) => state.user.auth);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentReport, setStudentReport] = useState(null);

  const fetchAssignments = async () => {
    try {
      const response = await getAssignments(subjectId);
      setAssignments(response?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [subjectId]);

  const openAssignment = async (assignment) => {
    try {
      setSelectedAssignment(assignment);
      const response = await getAssignmentReport(assignment._id, user.studentId);

      // assuming backend returns logged in student report
      setStudentReport(response?.student || null);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">

      {selectedAssignment ? (

        /* Assignment Detail View */
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="bg-slate-800 text-white p-6">

            <button
              onClick={() => setSelectedAssignment(null)}
              className="text-slate-300 hover:text-white mb-4"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold">
              {selectedAssignment.title}
            </h2>

            <p className="text-slate-400 mt-1">
              {selectedAssignment.description}
            </p>

            <div className="mt-3 text-sm text-slate-300">
              📅 Due Date :{" "}
              {new Date(selectedAssignment.dueDate).toLocaleDateString()}
            </div>

          </div>


          {/* Student Report */}
          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Submission Status */}
              <div className="bg-slate-50 border rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Submission Status
                </p>

                <h3
                  className={`text-xl font-bold mt-1 ${
                    studentReport?.submitted
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {studentReport?.submitted
                    ? "Submitted"
                    : "Not Submitted"}
                </h3>

              </div>


              {/* Marks */}
              <div className="bg-slate-50 border rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Marks Obtained
                </p>

                <h3 className="text-xl font-bold text-blue-600 mt-1">
                  {studentReport?.marks || "Not Graded"}
                </h3>

              </div>


              {/* Performance */}
              <div className="bg-slate-50 border rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Performance
                </p>

                <h3 className="text-xl font-bold mt-1">

                  {studentReport?.marks >= 80
                    ? "Excellent 🚀"
                    : studentReport?.marks >= 60
                    ? "Good 👍"
                    : studentReport?.marks
                    ? "Needs Improvement ⚠️"
                    : "-"}

                </h3>

              </div>

            </div>


            {/* Teacher Feedback (Optional future) */}
            {studentReport?.feedback && (
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h3 className="font-semibold text-blue-700">
                  Teacher Feedback
                </h3>

                <p className="text-sm text-slate-600 mt-1">
                  {studentReport.feedback}
                </p>

              </div>
            )}

          </div>

        </div>

      ) : (

        /* Assignment List */
        <div>

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            My Assignments
          </h2>

          {assignments.length === 0 ? (

            <div className="bg-white border-2 border-dashed rounded-xl p-10 text-center">
              <p className="text-slate-400">
                No Assignments Posted Yet
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {assignments.map((assignment) => (

                <div
                  key={assignment._id}
                  onClick={() => openAssignment(assignment)}
                  className="bg-white p-5 rounded-xl border cursor-pointer hover:shadow-md hover:border-blue-400 transition-all"
                >

                  <h3 className="font-bold text-slate-800">
                    {assignment.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {assignment.description}
                  </p>

                  <div className="flex justify-between mt-4 text-sm">

                    <span className="text-slate-500">
                      📅 {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>

                    <span className="text-blue-600 font-semibold">
                      View Details →
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default Assignment;