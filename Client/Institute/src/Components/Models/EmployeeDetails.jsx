import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  Award,
  Download,
  Eye,
  Star,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Building,
  CreditCard,
  BookOpen,
  Target,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getEmployeeDetails } from '../../Api/Employee';
import EmployeeModel from '../../../../../Server/Institute/Administration/Models/Employee.model';

function EmployeeDetailPage() {
  const employeeId = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeDetails(employeeId);
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to load employee data', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'qualification', label: 'Education', icon: GraduationCap },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'exit', label: 'Exit Details', icon: LogOut },
  ];

  const onBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600">
            {error || 'Employee not found'}
          </p>
        </div>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={`${API_URL}/employeeImages/${employee.imagePath}`}
            alt={employee.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {employee.name}
            </h2>
            <p className="text-lg text-gray-600">{employee.designation}</p>
            <p className="text-sm text-gray-500">{employee.department}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{employee.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">
                {new Date(employee.DOB).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Blood Group:</span>
              <span className="font-medium text-red-600">
                {employee.bloodGroup}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{employee.nationality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Marital Status:</span>
              <span className="font-medium">{employee.maritalStatus}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Contact Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 block">Mobile Numbers:</span>
              <span className="font-medium block">{employee.phoneNumber}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Email:</span>
              <span className="font-medium text-blue-600">
                {employee.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Permanent Address
          </h3>
          <p className="text-gray-700">{employee.permanentAddress}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Current Address
          </h3>
          <p className="text-gray-700">{employee.currentAddress}</p>
        </div>
      </div>

      {/* Emergency Contact & ID Proofs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Emergency Contact
          </h3>
          <div className="space-y-2">
            <p>
              <span className="text-gray-600">Name:</span>{' '}
              <span className="font-medium">{employee.name}</span>
            </p>
            <p>
              <span className="text-gray-600">Relationship:</span>{' '}
              <span className="font-medium">{employee.relationship}</span>
            </p>
            <p>
              <span className="text-gray-600">Phone:</span>{' '}
              <span className="font-medium">{employee.phone}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            ID Proofs
          </h3>
          <div className="space-y-2">
            {employee.aadhar && (
              <p>
                <span className="text-gray-600">Aadhar:</span>{' '}
                <span className="font-medium">{employee.aadhar}</span>
              </p>
            )}
            {EmployeeDetailPage.pan && (
              <p>
                <span className="text-gray-600">PAN:</span>{' '}
                <span className="font-medium">{employee.pan}</span>
              </p>
            )}
            {employee.passport && (
              <p>
                <span className="text-gray-600">Passport:</span>{' '}
                <span className="font-medium">{employee.passport}</span>
              </p>
            )}
            {employee.voterId && (
              <p>
                <span className="text-gray-600">Voter ID:</span>{' '}
                <span className="font-medium">{employee.voterId}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Job Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee ID:</span>
              <span className="font-medium">{employee.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department:</span>
              <span className="font-medium">{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Designation:</span>
              <span className="font-medium">{employee.designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Employment Type:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {employee.employmentType}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
            Work Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Joining:</span>
              <span className="font-medium">
                {new Date(employee.joiningDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reporting To:</span>
              <span className="font-medium">{employee.supervisor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shift Timings:</span>
              <span className="font-medium">{employee.shiftTimings}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Job Description
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {employee.jobDescription}
        </p>
      </div>
    </div>
  );

  const renderQualificationExperience = () => (
    <div className="space-y-6">
      {/* Educational Qualifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Educational Qualifications
        </h3>
        <div className="space-y-4">
          {employee.map((edu, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{edu.year}</p>
                  {edu.percentage && (
                    <p className="text-green-600 text-sm">{edu.percentage}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          Certifications
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {employee.map((cert, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-800">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Experience */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
          Previous Work Experience
        </h3>
        <div className="space-y-4">
          {employee.map((exp, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                  <p className="text-blue-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {employee.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-6">
      {/* Salary Structure */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
          Salary Structure
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              ₹{employee.financialInfo.salaryStructure.basic.toLocaleString()}
            </p>
            <p className="text-gray-600">Basic Salary</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              ₹
              {employee.financialInfo.salaryStructure.allowances.toLocaleString()}
            </p>
            <p className="text-gray-600">Allowances</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              ₹
              {employee.financialInfo.salaryStructure.deductions.toLocaleString()}
            </p>
            <p className="text-gray-600">Deductions</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              ₹{employee.financialInfo.salaryStructure.total.toLocaleString()}
            </p>
            <p className="text-gray-600">Net Salary</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Bank Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Name:</span>
              <span className="font-medium">
                {employee.financialInfo.bankDetails.bankName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account No:</span>
              <span className="font-medium font-mono">
                ****{employee.financialInfo.bankDetails.accountNo.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IFSC Code:</span>
              <span className="font-medium font-mono">
                {employee.financialInfo.bankDetails.ifsc}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Branch:</span>
              <span className="font-medium">
                {employee.financialInfo.bankDetails.branch}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Statutory Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">PAN Number:</span>
              <span className="font-medium font-mono">
                {employee.financialInfo.panNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PF Details:</span>
              <span className="font-medium">
                {employee.financialInfo.pfDetails}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ESI Details:</span>
              <span className="font-medium">
                {employee.financialInfo.esiDetails}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Mode:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {employee.financialInfo.paymentMode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceLeave = () => (
    <div className="space-y-6">
      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          This Month's Attendance
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {employee.attendanceLeave.attendanceRecords.presentDays}
            </p>
            <p className="text-gray-600">Present Days</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">
              {employee.attendanceLeave.attendanceRecords.totalDays}
            </p>
            <p className="text-gray-600">Total Days</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {employee.attendanceLeave.attendanceRecords.lateComings}
            </p>
            <p className="text-gray-600">Late Comings</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Attendance Rate</span>
            <span>
              {Math.round(
                (employee.attendanceLeave.attendanceRecords.presentDays /
                  employee.attendanceLeave.attendanceRecords.totalDays) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{
                width: `${(employee.attendanceLeave.attendanceRecords.presentDays / employee.attendanceLeave.attendanceRecords.totalDays) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Leave Balance
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {employee.attendanceLeave.leaveBalance.casualLeave}
            </p>
            <p className="text-gray-600">Casual Leave</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {employee.attendanceLeave.leaveBalance.sickLeave}
            </p>
            <p className="text-gray-600">Sick Leave</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {employee.attendanceLeave.leaveBalance.paidLeave}
            </p>
            <p className="text-gray-600">Paid Leave</p>
          </div>
        </div>
      </div>

      {/* Overtime */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Overtime This Month
        </h3>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <p className="text-3xl font-bold text-purple-600">
            {employee.attendanceLeave.overtimeHours}
          </p>
          <p className="text-gray-600">Hours</p>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Current Rating */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-blue-600" />
          Current Performance Rating
        </h3>
        <div className="text-center p-6">
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= employee.performance.currentRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {employee.performance.currentRating}/5.0
          </p>
          <p className="text-gray-600 mt-2">
            Last Appraisal:{' '}
            {new Date(
              employee.performance.lastAppraisalDate
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Promotions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Career Progression
        </h3>
        <div className="space-y-4">
          {employee.performance.promotions.map((promotion, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {promotion.from} → {promotion.to}
                </p>
                <p className="text-green-600 text-sm">
                  {new Date(promotion.date).toLocaleDateString()}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          Achievements & Awards
        </h3>
        <div className="space-y-3">
          {employee.performance.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
            >
              <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
              <span className="text-gray-800">{achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
          Disciplinary Record
        </h3>
        <div className="text-center p-6">
          {employee.performance.warnings === 0 ? (
            <div className="text-green-600">
              <CheckCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="font-semibold">Clean Record</p>
              <p className="text-sm">No disciplinary actions</p>
            </div>
          ) : (
            <div className="text-red-600">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {employee.performance.warnings}
              </p>
              <p className="text-sm">Warning(s) issued</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Employee Documents
        </h3>
        <div className="grid gap-4">
          {employee.documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {doc.size} • Uploaded on{' '}
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExitDetails = () => (
    <div className="space-y-6">
      {employee.exitInfo ? (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <LogOut className="w-5 h-5 mr-2 text-red-600" />
              Exit Information
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Resignation Date:</span>
                  <p className="font-medium">
                    {new Date(
                      employee.exitInfo.resignationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Final Settlement:</span>
                  <p className="font-medium text-green-600">
                    ₹{employee.exitInfo.finalSettlement.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Reason for Leaving:</span>
                <p className="font-medium mt-1">{employee.exitInfo.reason}</p>
              </div>
              <div>
                <span className="text-gray-600">Exit Interview Notes:</span>
                <p className="mt-1 text-gray-700">
                  {employee.exitInfo.exitInterviewNotes}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Active Employee
          </h3>
          <p className="text-gray-600">
            This employee is currently active and has not submitted any
            resignation.
          </p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'employment':
        return renderEmploymentDetails();
      case 'qualification':
        return renderQualificationExperience();
      case 'financial':
        return renderFinancialInfo();
      case 'attendance':
        return renderAttendanceLeave();
      case 'performance':
        return renderPerformance();
      case 'documents':
        return renderDocuments();
      case 'exit':
        return renderExitDetails();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Employee Profile
              </h1>
              <p className="text-gray-600">
                Comprehensive employee information and records
              </p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`-ml-0.5 mr-2 h-4 w-4 ${
                        activeTab === tab.id
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default EmployeeDetailPage;
