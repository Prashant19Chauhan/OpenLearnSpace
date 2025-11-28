import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Bell,
  MessageSquare,
  AlertTriangle,
  Eye,
  Trash2,
  Edit,
  Send,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import PublishNotice from '../Models/PublishNotice';
import ViewComplaint from '../Models/ViewComplaint';
import { noticeList } from '../../Api/communication';

const getComplaints = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    data: [
      {
        _id: '1',
        title: 'Cafeteria Food Quality Issues',
        description:
          'The food quality in the cafeteria has been consistently poor. Students are facing health issues.',
        category: 'Facilities',
        priority: 'High',
        status: 'In Progress',
        submittedBy: 'Anonymous Student',
        submittedDate: '2024-03-02',
        assignedTo: 'Facilities Manager',
        lastUpdated: '2024-03-03',
      },
      {
        _id: '2',
        title: 'Classroom Air Conditioning Not Working',
        description:
          'The AC in Room 204 has been malfunctioning for the past week, making it difficult to concentrate during classes.',
        category: 'Maintenance',
        priority: 'Medium',
        status: 'Pending',
        submittedBy: 'John Smith',
        submittedDate: '2024-03-01',
        assignedTo: 'Maintenance Team',
        lastUpdated: '2024-03-01',
      },
      {
        _id: '3',
        title: 'Parking Space Shortage',
        description:
          'There are insufficient parking spaces for faculty members, causing daily inconvenience.',
        category: 'Infrastructure',
        priority: 'Low',
        status: 'Resolved',
        submittedBy: 'Dr. James Wilson',
        submittedDate: '2024-02-28',
        assignedTo: 'Administration',
        lastUpdated: '2024-03-02',
      },
    ],
  };
};

const Communication = () => {
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintsResponse] = await Promise.all([
          getComplaints(),
        ]);
        const noticesResponse = await noticeList();

        if (noticesResponse?.data){
          setNotices(noticesResponse.data.notices);
          setLoading(false);
        }
        if (complaintsResponse?.data) setComplaints(complaintsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || notice.type === selectedType;
    const matchesStatus =
      selectedStatus === 'All' || notice.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'All' || complaint.category === selectedType;
    const matchesStatus =
      selectedStatus === 'All' || complaint.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const NoticeCard = ({ notice }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="text-purple-600" size={18} />
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
              {notice.title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {notice.content}
          </p>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors">
            <Eye size={16} />
          </button>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}
          >
            {notice.status}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}
          >
            {notice.priority}
          </span>
          <span className="text-gray-500">{notice.type}</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{notice.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(notice.publishedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <User size={14} />
          <span>By {notice.publishedBy}</span>
        </div>
        <span>Target: {notice.targetAudience}</span>
      </div>
    </div>
  );

  const ComplaintCard = ({ complaint }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="text-orange-600" size={18} />
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
              {complaint.title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {complaint.description}
          </p>
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setSelectedComplaint(complaint)}
            className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Eye size={16} />
          </button>
          <button className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
            <CheckCircle size={16} />
          </button>
          <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
            <XCircle size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center space-x-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}
          >
            {complaint.status}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}
          >
            {complaint.priority}
          </span>
          <span className="text-gray-500">{complaint.category}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span>By {complaint.submittedBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>
              {new Date(complaint.submittedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Assigned to: {complaint.assignedTo}</span>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>
              Updated: {new Date(complaint.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Communication Management
          </h1>
          <p className="text-gray-600">
            Manage notices and handle complaints efficiently
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-fit">
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'notices'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell size={18} />
            <span>Notices</span>
            <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
              {notices.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'complaints'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={18} />
            <span>Complaints</span>
            <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
              {complaints.length}
            </span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {activeTab === 'notices' && (
              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span className="font-medium">Publish Notice</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {activeTab === 'notices' ? (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Notices
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notices.length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Bell className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {notices.filter((n) => n.status === 'Active').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      High Priority
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {notices.filter((n) => n.priority === 'High').length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Views
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      0
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Eye className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Complaints
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complaints.length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <MessageSquare className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {complaints.filter((c) => c.status === 'Pending').length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        complaints.filter((c) => c.status === 'In Progress')
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Send className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Resolved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {complaints.filter((c) => c.status === 'Resolved').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="text-purple-600" size={20} />
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {activeTab === 'notices' ? 'Type' : 'Category'}
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  >
                    <option value="All">All</option>
                    {activeTab === 'notices' ? (
                      <>
                        <option value="Academic">Academic</option>
                        <option value="General">General</option>
                        <option value="Event">Event</option>
                      </>
                    ) : (
                      <>
                        <option value="Facilities">Facilities</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  >
                    <option value="All">All</option>
                    {activeTab === 'notices' ? (
                      <>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </>
                    ) : (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-2xl text-gray-900">
                  {activeTab === 'notices'
                    ? 'Published Notices'
                    : 'Complaint Management'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'notices'
                    ? `${filteredNotices.length} of ${notices.length} notices`
                    : `${filteredComplaints.length} of ${complaints.length} complaints`}
                </p>
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-6">
                {activeTab === 'notices' ? (
                  filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                      <NoticeCard key={notice._id} notice={notice} />
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Notices Found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm ||
                        selectedType !== 'All' ||
                        selectedStatus !== 'All'
                          ? 'Try adjusting your search criteria or filters.'
                          : 'Get started by publishing your first notice.'}
                      </p>
                      <button
                        onClick={() => setShowPublishModal(true)}
                        className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        <Plus size={18} />
                        <span>Publish Notice</span>
                      </button>
                    </div>
                  )
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <ComplaintCard key={complaint._id} complaint={complaint} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Complaints Found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ||
                      selectedType !== 'All' ||
                      selectedStatus !== 'All'
                        ? 'Try adjusting your search criteria or filters.'
                        : 'No complaints have been submitted yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPublishModal && (
        <PublishNotice
          onClose={() => setShowPublishModal(false)}
          onNoticePublished={(newNotice) => {
            setNotices((prev) => [newNotice, ...prev]);
            setShowPublishModal(false);
          }}
        />
      )}

      {selectedComplaint && (
        <ViewComplaint
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdate={(updatedComplaint) => {
            setComplaints((prev) =>
              prev.map((c) =>
                c._id === updatedComplaint._id ? updatedComplaint : c
              )
            );
            setSelectedComplaint(null);
          }}
        />
      )}
    </div>
  );
};

export default Communication;
