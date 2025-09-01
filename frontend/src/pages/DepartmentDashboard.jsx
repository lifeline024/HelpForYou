import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Shield, LogOut, CheckCircle, XCircle, Filter, Download, User, Lock, AlertCircle, FileText, Mail, Phone, MapPin, Calendar, Clock, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
const DepartmentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Department credentials from environment variables with fallback
  const departmentCredentials = {
    'POL100': { 
      password: 'POL100', 
      department: 'police', 
      district: 'All Districts', 
      name: 'Police Headquarters' 
    },
    'POL101': { 
      password: 'POL101', 
      department: 'police', 
      district: 'Patna', 
      name: 'Patna Police' 
    },
    'POL102': { 
      password: 'POL102', 
      department: 'police', 
      district: 'Gaya', 
      name: 'Gaya Police' 
    },
    'POL103': { 
      password: 'POL103', 
      department: 'police', 
      district: 'Bhagalpur', 
      name: 'Bhagalpur Police' 
    },
    'CYB118': { 
      password: 'CYB118', 
      department: 'cyber', 
      name: 'Cyber Crime Unit' 
    },
    'CYB119': { 
      password: 'CYB119', 
      department: 'cyber', 
      name: 'Cyber Security Division' 
    }
  };

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('departmentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
      fetchComplaints(userData.department, userData.district);
    }
  }, []);

  // Login function
  const handleLogin = (e) => {
    e.preventDefault();
    const { id, password } = loginData;
    
    if (!departmentCredentials[id]) {
      setLoginError('Invalid Department ID');
      return;
    }

    if (departmentCredentials[id].password !== password) {
      setLoginError('Invalid Password');
      return;
    }

    const userData = {
      id,
      ...departmentCredentials[id]
    };
    
    setUser(userData);
    setIsLoggedIn(true);
    setLoginError('');
    
    // Save to localStorage to persist login
    localStorage.setItem('departmentUser', JSON.stringify(userData));
    
    fetchComplaints(userData.department, userData.district);
  };

  // Fetch complaints based on department and district
  const fetchComplaints = async (department, district = 'all') => {
    setLoading(true);
    try {
      let endpoint = '';
      if (department === 'police') {
        endpoint = district === 'All Districts' 
          ? 'https://helpforyou-backend.onrender.com/api/complaints'
          : `https://helpforyou-backend.onrender.com/api/complaints?district=${district}`;
      } else {
        endpoint = 'https://helpforyou-backend.onrender.com/api/cyber-complaints';
      }

      const response = await axios.get(endpoint);
      setComplaints(response.data.complaints || []);
      setFilteredComplaints(response.data.complaints || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status
  const updateComplaintStatus = async (complaintId, newStatus, reason = '') => {
    setActionLoading(complaintId);
    try {
      const isPoliceComplaint = complaintId.startsWith('POL');
      const endpoint = isPoliceComplaint 
        ? `https://helpforyou-backend.onrender.com/api/complaints/update-status/${complaintId}`
        : `https://helpforyou-backend.onrender.com/api/cyber-complaints/update-status/${complaintId}`;

      const token = localStorage.getItem('token');
      await axios.put(endpoint, { 
        status: newStatus,
        reason: reason || `Complaint ${newStatus.toLowerCase()} by ${user.name}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh complaints
      fetchComplaints(user.department, user.district);
    } catch (error) {
      console.error('Error updating complaint status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter complaints based on search and status
  useEffect(() => {
    let filtered = complaints;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.subject && complaint.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (complaint.complaintType && complaint.complaintType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  }, [searchTerm, statusFilter, complaints]);

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setComplaints([]);
    setFilteredComplaints([]);
    setLoginData({ id: '', password: '' });
    localStorage.removeItem('departmentUser');
  };

  // View complaint details
  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Department Login</h1>
            <p className="text-sm md:text-base text-gray-600">Access your department dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  value={loginData.id}
                  onChange={(e) => setLoginData({...loginData, id: e.target.value})}
                  className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter Department ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 md:py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Login to Dashboard
            </button> <br></br><br></br>
           <Link to="/update-status">
  <button
    className="px-5 py-2 md:px-6 md:py-2.5 
               bg-gradient-to-r from-purple-600 to-pink-600 
               text-white text-sm md:text-base font-medium 
               rounded-full shadow-md 
               hover:from-purple-700 hover:to-pink-700 
               hover:scale-105 hover:shadow-lg 
               focus:outline-none focus:ring-2 focus:ring-purple-400 
               transition-all duration-300 ease-in-out"
  >
    Update Status
  </button>
</Link>
          </form>
        </div>
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-2 md:mr-3" />
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-gray-900">{user.name} Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500">
                  {user.department === 'police' ? `District: ${user.district}` : 'Cyber Crime Department'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow p-3 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-gray-900">{complaints.length}</div>
            <div className="text-xs md:text-sm text-gray-500">Total Complaints</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-blue-600">
              {complaints.filter(c => c.status === 'Requested').length}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-green-600">
              {complaints.filter(c => c.status === 'Resolved').length}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 md:p-6">
            <div className="text-lg md:text-2xl font-bold text-red-600">
              {complaints.filter(c => c.status === 'Rejected').length}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search complaints by ID, name, subject, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-1 md:mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 md:px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="Requested">Requested</option>
                  <option value="Received at department">Received</option>
                  <option value="Under Processing">Processing</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Unsolved">Unsolved</option>
                </select>
              </div>
              <button className="flex items-center text-gray-600 hover:text-gray-900 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 md:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 md:mt-4 text-gray-600 text-sm md:text-base">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-6 md:p-8 text-center">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 text-sm md:text-base">No complaints found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {user.department === 'police' ? 'Complaint' : 'Subject'}
                    </th>
                    {user.department === 'police' && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => viewComplaintDetails(complaint)}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.complaintId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {complaint.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {user.department === 'police' ? complaint.complaint : complaint.subject}
                        </div>
                      </td>
                      {user.department === 'police' && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.district}
                        </td>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          complaint.status === 'Requested' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        {complaint.status === 'Requested' && (
                          <div className="flex flex-col md:flex-row md:space-x-2 space-y-1 md:space-y-0">
                            <button
                              onClick={() => updateComplaintStatus(complaint.complaintId, 'Received at department')}
                              disabled={actionLoading === complaint.complaintId}
                              className="flex items-center text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50 text-xs md:text-sm disabled:opacity-50"
                            >
                              {actionLoading === complaint.complaintId ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                              ) : (
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              )}
                              Accept
                            </button>
                            <button
                              onClick={() => updateComplaintStatus(complaint.complaintId, 'Rejected', 'Rejected by department')}
                              disabled={actionLoading === complaint.complaintId}
                              className="flex items-center text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 text-xs md:text-sm disabled:opacity-50"
                            >
                              {actionLoading === complaint.complaintId ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                              ) : (
                                <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              )}
                              Reject
                            </button>
                          </div>
                        )}
                        {complaint.status === 'Received at department' && (
                          <button
                            onClick={() => updateComplaintStatus(complaint.complaintId, 'Under Processing')}
                            disabled={actionLoading === complaint.complaintId}
                            className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 text-xs md:text-sm disabled:opacity-50"
                          >
                            {actionLoading === complaint.complaintId ? 'Processing...' : 'Start Processing'}
                          </button>
                        )}
                        {complaint.status === 'Under Processing' && (
                          <button
                            onClick={() => updateComplaintStatus(complaint.complaintId, 'Resolved')}
                            disabled={actionLoading === complaint.complaintId}
                            className="text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50 text-xs md:text-sm disabled:opacity-50"
                          >
                            {actionLoading === complaint.complaintId ? 'Updating...' : 'Mark Resolved'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Complaint Details Modal */}
        {showDetailsModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Complaint Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6 md:w-7 md:h-7" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                      <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Complaint Information
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm md:text-base">Complaint ID:</span>
                        <span className="font-medium text-sm md:text-base">{selectedComplaint.complaintId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm md:text-base">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedComplaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          selectedComplaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          selectedComplaint.status === 'Requested' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedComplaint.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm md:text-base">Type:</span>
                        <span className="font-medium text-sm md:text-base">{selectedComplaint.complaintType || 'Police Complaint'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm md:text-base">Created:</span>
                        <span className="font-medium text-sm md:text-base">
                          {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedComplaint.district && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm md:text-base">District:</span>
                          <span className="font-medium text-sm md:text-base">{selectedComplaint.district}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                      <User className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Complainant Information
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-sm md:text-base">{selectedComplaint.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-sm md:text-base">{selectedComplaint.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-sm md:text-base">{selectedComplaint.phone || selectedComplaint.mobile}</span>
                      </div>
                      {(selectedComplaint.address || selectedComplaint.location) && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-sm md:text-base">
                            {selectedComplaint.address || selectedComplaint.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Complaint Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {user.department === 'police' ? 'Complaint Description' : 'Subject & Description'}
                  </h3>
                  {selectedComplaint.subject && (
                    <div className="mb-3 md:mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Subject:</h4>
                      <p className="text-gray-900 text-sm md:text-base">{selectedComplaint.subject}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-900 whitespace-pre-wrap text-sm md:text-base">
                      {selectedComplaint.description || selectedComplaint.complaint}
                    </p>
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedComplaint.transactionId || selectedComplaint.amountInvolved) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Additional Information</h3>
                    <div className="space-y-2 md:space-y-3">
                      {selectedComplaint.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm md:text-base">Transaction ID:</span>
                          <span className="font-medium text-sm md:text-base">{selectedComplaint.transactionId}</span>
                        </div>
                      )}
                      {selectedComplaint.amountInvolved && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm md:text-base">Amount Involved:</span>
                          <span className="font-medium text-sm md:text-base">₹{selectedComplaint.amountInvolved}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Evidence Files */}
                {(selectedComplaint.evidenceFiles || selectedComplaint.proofFiles) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Attached Evidence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                      {(selectedComplaint.evidenceFiles || selectedComplaint.proofFiles || []).map((file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 md:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-colors"
                        >
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2 md:mr-3" />
                          <span className="text-xs md:text-sm font-medium text-gray-700 truncate">
                            Evidence {index + 1}
                          </span>
                          <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-gray-400 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Department Response */}
                {selectedComplaint.reason && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-3 md:mb-4">Department Response</h3>
                    <p className="text-blue-800 whitespace-pre-wrap text-sm md:text-base">{selectedComplaint.reason}</p>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-3 md:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    viewComplaintDetails(selectedComplaint);
                  }}
                  className="px-3 md:px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                >
                  Take Action
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DepartmentDashboard;
