import React from "react";

function Attendance() {

  // Dummy Data (Replace with API later)
  const attendanceData = [
    { date: "2026-04-01", status: "Present" },
    { date: "2026-04-02", status: "Absent" },
    { date: "2026-04-03", status: "Present" },
    { date: "2026-04-04", status: "Present" },
    { date: "2026-04-05", status: "Absent" },
    { date: "2026-04-06", status: "Present" },
    { date: "2026-04-07", status: "Present" },
  ];

  const presentCount = attendanceData.filter(a => a.status === "Present").length;
  const absentCount = attendanceData.length - presentCount;
  const percentage = ((presentCount / attendanceData.length) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Attendance Percentage */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-slate-500">Attendance</h3>
          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-3xl font-bold text-blue-600">
              {percentage}%
            </h2>
            <span className="text-sm text-slate-500 mb-1">
              This Month
            </span>
          </div>

          <div className="mt-4 bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>


        {/* Present */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-slate-500">
            Present Days
          </h3>

          <h2 className="text-3xl font-bold text-emerald-600 mt-2">
            {presentCount}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Out of {attendanceData.length} classes
          </p>
        </div>


        {/* Absent */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-slate-500">
            Absent Days
          </h3>

          <h2 className="text-3xl font-bold text-rose-500 mt-2">
            {absentCount}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Need improvement
          </p>
        </div>

      </div>


      {/* Attendance History */}
      <div className="bg-white border rounded-2xl shadow-sm">

        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">
            Attendance History
          </h2>
        </div>

        <div className="divide-y">

          {attendanceData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 hover:bg-slate-50"
            >

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  📅
                </div>

                <div>
                  <p className="font-medium">
                    {item.date}
                  </p>

                  <p className="text-xs text-slate-400">
                    Class Attendance
                  </p>
                </div>
              </div>

              <div>
                {item.status === "Present" ? (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                    Present
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-600">
                    Absent
                  </span>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>



      {/* Projection Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">

        <h2 className="text-lg font-bold">
          Attendance Projection
        </h2>

        <p className="text-blue-100 mt-1">
          Based on your current attendance
        </p>

        <div className="mt-4 flex items-center justify-between">

          <div>
            <h3 className="text-2xl font-bold">
              {percentage}%
            </h3>

            <p className="text-blue-200 text-sm">
              Expected Final Attendance
            </p>
          </div>

          <div className="text-right">
            {percentage >= 75 ? (
              <p className="text-emerald-200 font-semibold">
                ✅ Safe Attendance
              </p>
            ) : (
              <p className="text-yellow-200 font-semibold">
                ⚠️ Attend More Classes
              </p>
            )}

            <p className="text-xs text-blue-200 mt-1">
              Minimum required: 75%
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Attendance;