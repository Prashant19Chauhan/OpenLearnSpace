import React, { useState } from "react";

function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([
    { id: 1, name: "Rahul Sharma", present: false },
    { id: 2, name: "Amit Kumar", present: false },
    { id: 3, name: "Priya Singh", present: false },
    { id: 4, name: "Neha Verma", present: false },
    { id: 5, name: "Rohit Gupta", present: false },
  ]);

  // Handle single checkbox
  const handleCheckbox = (id) => {
    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, present: !student.present } : student
    );
    setStudents(updatedStudents);
  };

  // Select All
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const updatedStudents = students.map((student) => ({
      ...student,
      present: checked,
    }));
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    console.log("Saving Attendance for:", date);
    console.log("Data:", students);
    alert("Attendance saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daily Attendance</h2>
          <p className="text-sm text-slate-500">Mark students present or absent for today's session.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-600">Date:</label>
          <input
            type="date"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search student name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:bg-slate-50 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-slate-50">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-16">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={students.every((s) => s.present) && students.length > 0}
                />
              </th>
              <th className="p-4 text-left text-sm font-semibold text-slate-700">Student Name</th>
              <th className="p-4 text-right text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className={`transition-colors ${
                    student.present ? "bg-emerald-50/30" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                      checked={student.present}
                      onChange={() => handleCheckbox(student.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {student.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium ${student.present ? "text-emerald-900" : "text-slate-700"}`}>
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {student.present ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                        ● Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600 uppercase tracking-wide">
                        ○ Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-slate-400 italic">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Summary */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
          Summary: <span className="font-bold text-emerald-600">{students.filter(s => s.present).length}</span> Present /{" "}
          <span className="font-bold text-rose-500">{students.filter(s => !s.present).length}</span> Absent
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}

export default Attendance;