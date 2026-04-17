import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie, Legend
} from 'recharts';

// 1. Dummy Data for a Batch of Students
const performanceData = [
  { name: 'Rahul S.', attendance: 85, assignment: 80, performance: 78, contentViewed: 90 },
  { name: 'Amit K.', attendance: 92, assignment: 88, performance: 90, contentViewed: 95 },
  { name: 'Priya S.', attendance: 75, assignment: 70, performance: 72, contentViewed: 60 },
  { name: 'Neha V.', attendance: 98, assignment: 95, performance: 96, contentViewed: 100 },
  { name: 'Rohit G.', attendance: 60, assignment: 55, performance: 58, contentViewed: 40 },
  { name: 'Suman D.', attendance: 88, assignment: 82, performance: 85, contentViewed: 85 },
];

// 2. Data for Distribution Chart (Grade Brackets)
const distributionData = [
  { range: '90-100', count: 2, fill: '#10b981' },
  { range: '80-89', count: 2, fill: '#3b82f6' },
  { range: '70-79', count: 1, fill: '#f59e0b' },
  { range: '< 70', count: 1, fill: '#ef4444' },
];

function Performance() {
  // Simple average calculations
  const avgAttendance = (performanceData.reduce((acc, curr) => acc + curr.attendance, 0) / performanceData.length).toFixed(1);
  const avgPerformance = (performanceData.reduce((acc, curr) => acc + curr.performance, 0) / performanceData.length).toFixed(1);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Subject Performance Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time projections based on attendance and assignment completion.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Avg. Attendance', value: `${avgAttendance}%`, color: 'text-blue-600' },
            { label: 'Avg. Performance', value: `${avgPerformance}%`, color: 'text-emerald-600' },
            { label: 'Active Students', value: performanceData.length, color: 'text-slate-700' },
            { label: 'Syllabus Coverage', value: '64%', color: 'text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Performance vs Attendance Correlation */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance vs Score Impact</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="attendance" name="Attendance" unit="%" stroke="#94a3b8" fontSize={12} />
                  <YAxis type="number" dataKey="performance" name="Score" unit="%" stroke="#94a3b8" fontSize={12} />
                  <ZAxis type="number" dataKey="contentViewed" range={[50, 400]} name="Content Completion" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Scatter name="Students" data={performanceData} fill="#3b82f6">
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.performance > 80 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-4 italic">*Bubble size indicates syllabus content viewed by the student.</p>
          </div>

          {/* Chart 2: Grade Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Class Score Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Table: Performance Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Student Ranking (Subject Wise)</h3>
              <button className="text-blue-600 text-sm font-semibold hover:underline">Export Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4">Assignments</th>
                    <th className="px-6 py-4">Content</th>
                    <th className="px-6 py-4 text-right">Final Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {performanceData.sort((a,b) => b.performance - a.performance).map((student, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{student.name}</td>
                      <td className="px-6 py-4 text-slate-600">{student.attendance}%</td>
                      <td className="px-6 py-4 text-slate-600">{student.assignment}%</td>
                      <td className="px-6 py-4 text-slate-600">{student.contentViewed}%</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          student.performance >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                          student.performance >= 60 ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {student.performance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Performance;