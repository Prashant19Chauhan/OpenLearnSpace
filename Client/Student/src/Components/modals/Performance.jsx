import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  BarChart,
  Bar
} from "recharts";

// Dummy Student Data
const studentPerformance = {
  name: "Rahul Sharma",
  attendance: 82,
  assignment: 76,
  performance: 78,
  contentViewed: 85
};

// Monthly Progress Data
const progressData = [
  { month: "Jan", score: 60 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 78 },
  { month: "May", score: 82 },
];

// Subject Metrics
const metricsData = [
  { name: "Attendance", value: studentPerformance.attendance, fill: "#3b82f6" },
  { name: "Assignments", value: studentPerformance.assignment, fill: "#10b981" },
  { name: "Content", value: studentPerformance.contentViewed, fill: "#8b5cf6" },
];

function Performance() {

  const projectedScore = Math.min(
    100,
    (
      (studentPerformance.attendance * 0.3) +
      (studentPerformance.assignment * 0.3) +
      (studentPerformance.contentViewed * 0.4)
    ).toFixed(1)
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            My Performance
          </h1>
          <p className="text-slate-500 text-sm">
            Track your subject performance and improvement
          </p>
        </div>


        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          {[
            {
              label: "Attendance",
              value: `${studentPerformance.attendance}%`,
              color: "text-blue-600"
            },
            {
              label: "Assignments",
              value: `${studentPerformance.assignment}%`,
              color: "text-emerald-600"
            },
            {
              label: "Content Viewed",
              value: `${studentPerformance.contentViewed}%`,
              color: "text-purple-600"
            },
            {
              label: "Projected Score",
              value: `${projectedScore}%`,
              color: "text-orange-600"
            }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
            >
              <p className="text-xs font-bold text-slate-400 uppercase">
                {stat.label}
              </p>

              <p className={`text-2xl font-black mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}

        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Performance Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">

            <h3 className="text-lg font-bold mb-6">
              Performance Trend
            </h3>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>
          </div>


          {/* Subject Metrics */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">

            <h3 className="text-lg font-bold mb-6">
              Subject Metrics
            </h3>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="value" radius={[6,6,0,0]}>
                    {metricsData.map((entry, index) => (
                      <cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>


          {/* Projection Card */}
          <div className="lg:col-span-2">

            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">

              <h3 className="text-lg font-bold">
                Performance Projection
              </h3>

              <p className="text-indigo-200 text-sm mt-1">
                Based on your learning behavior
              </p>

              <div className="flex justify-between items-center mt-4">

                <div>
                  <h2 className="text-3xl font-bold">
                    {projectedScore}%
                  </h2>

                  <p className="text-indigo-200 text-sm">
                    Expected Final Score
                  </p>
                </div>

                <div className="text-right">

                  {projectedScore >= 80 ? (
                    <p className="text-emerald-200 font-semibold">
                      🚀 Excellent Progress
                    </p>
                  ) : projectedScore >= 60 ? (
                    <p className="text-yellow-200 font-semibold">
                      ⚡ Keep Improving
                    </p>
                  ) : (
                    <p className="text-rose-200 font-semibold">
                      ⚠️ Need Attention
                    </p>
                  )}

                  <p className="text-xs text-indigo-200 mt-1">
                    Continue assignments & content
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Performance;