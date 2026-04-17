import React, { useEffect, useState } from "react";
import {
  addAssignment,
  getAssignments,
  updateStudentReport,
  getAssignmentReport,
} from "../../Api/subject";

function Assignment({ studentsData, batchId }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  let formattedStudents = [];
  if (studentsData?.students) {
    formattedStudents = studentsData.students.map((student) => ({
      ...student,
      submitted: false,
      marks: "",
    }));
  }

  const [students, setStudents] = useState(formattedStudents);

  const fetchAssignments = async () => {
    try {
      const response = await getAssignments(batchId);
      setAssignments(response?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [batchId]);

  const handleAddAssignment = async () => {
    if (!title || !dueDate) return alert("Please fill Title and Due Date");
    try {
      const payload = { title, description, dueDate, batchId };
      await addAssignment(payload);
      fetchAssignments();
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.log(error);
    }
  };

  const openAssignment = async (assignment) => {
    try {
      setSelectedAssignment(assignment);
      const response = await getAssignmentReport(assignment._id);
      if (response?.students) {
        if(response?.students.length<1){
          setStudents(formattedStudents);
        }
        else{
          setStudents(response.students);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitToggle = (studentId) => {
    const updated = students.map((s) =>
      s.studentId === studentId ? { ...s, submitted: !s.submitted } : s
    );
    setStudents(updated);
  };

  const handleMarks = (studentId, value) => {
    const updated = students.map((s) =>
      s.studentId === studentId ? { ...s, marks: value } : s
    );
    setStudents(updated);
  };

  const handleUpdateReport = async () => {
    try {
      const payload = { assignmentId: selectedAssignment._id, students, batchId };
      await updateStudentReport(payload);
      alert("Report Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">
      {selectedAssignment ? (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Detailed View Header */}
          <div className="bg-slate-800 text-white p-6">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="flex items-center text-slate-300 hover:text-white mb-4 transition-colors"
            >
              <span className="mr-2">←</span> Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold">{selectedAssignment.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{selectedAssignment.description}</p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold text-slate-700 text-sm">Student Name</th>
                    <th className="p-4 font-semibold text-slate-700 text-sm text-center">Submission Status</th>
                    <th className="p-4 font-semibold text-slate-700 text-sm">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.studentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-700 font-medium">{student.name}</td>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                          checked={student.submitted}
                          onChange={() => handleSubmitToggle(student.studentId)}
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          className="border border-slate-300 rounded-md p-1.5 w-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="00"
                          value={student.marks}
                          onChange={(e) => handleMarks(student.studentId, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdateReport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-lg transition-all"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">✍️</span>
                New Assignment
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Unit 1 Quiz"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    rows="3"
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Provide details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleAddAssignment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98]"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">📋</span>
              Recent Assignments
            </h2>

            {assignments.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                <p className="text-slate-400">No assignments have been posted yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    onClick={() => openAssignment(assignment)}
                    className="group bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100" />
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center mt-3 text-slate-500 text-sm">
                      <span className="mr-2">📅</span>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignment;