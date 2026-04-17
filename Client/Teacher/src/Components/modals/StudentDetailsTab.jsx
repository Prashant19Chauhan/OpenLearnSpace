import React, { useState } from "react";

function StudentDetailsTab({ studentsData }) {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data - replace with dynamic studentsData if needed
  const students = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      attendance: 85,
      assignment: 80,
      performance: 78,
      phone: "9876543210",
      avatar: "RS"
    },
    {
      id: 2,
      name: "Amit Kumar",
      email: "amit@gmail.com",
      attendance: 92,
      assignment: 88,
      performance: 90,
      phone: "9876543211",
      avatar: "AK"
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      attendance: 75,
      assignment: 70,
      performance: 72,
      phone: "9876543212",
      avatar: "PS"
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-100";
    return "text-amber-600 bg-amber-50 border-amber-100";
  };

  // Student Details View
  if (selectedStudent) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-300">
        <button
          onClick={() => setSelectedStudent(null)}
          className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> 
          Back to Students List
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-800 shadow-lg">
                {selectedStudent.avatar}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">{selectedStudent.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-slate-300">
                  <span className="flex items-center gap-1 text-sm">📧 {selectedStudent.email}</span>
                  <span className="flex items-center gap-1 text-sm">📞 {selectedStudent.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Attendance", value: selectedStudent.attendance },
                { label: "Assignment", value: selectedStudent.assignment },
                { label: "Performance", value: selectedStudent.performance },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
                  <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black ${getScoreColor(stat.value).split(' ')[0]}`}>
                    {stat.value}%
                  </p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${stat.value >= 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Communication Section */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
                  Send Message
                </button>
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95">
                  Call Student
                </button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95">
                  Email Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student List View
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Directory</h2>
        <span className="text-slate-400 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
          {students.length} Total Students
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Student</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Attendance</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Assignment</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Performance</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getScoreColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getScoreColor(student.assignment)}`}>
                      {student.assignment}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getScoreColor(student.performance)}`}>
                      {student.performance}%
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        View Details
                      </button>
                      <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">
                        Chat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsTab;