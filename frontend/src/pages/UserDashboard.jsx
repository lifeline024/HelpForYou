import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to view your complaints');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://helpforyou-backend.onrender.com/api/complaints/my-complaints',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setComplaints(response.data.complaints);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setMessage(error.response?.data?.message || 'Error fetching complaints');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Received at department':
        return 'bg-blue-100 text-blue-800';
      case 'Under Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Unsolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openComplaintModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closeComplaintModal = () => {
    setSelectedComplaint(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Complaints</h2>
      
      {message && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-md">
          {message}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No complaints filed yet</div>
          <p className="text-gray-400 mt-2">Your filed complaints will appear here</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openComplaintModal(complaint)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {complaint.complaintId}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">District:</span> {complaint.district}</p>
                <p><span className="font-medium">Location:</span> {complaint.location}</p>
                <p><span className="font-medium">Filed:</span> {formatDate(complaint.createdAt)}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {complaint.complaint}
                </p>
              </div>
              
              {complaint.proofFiles && complaint.proofFiles.length > 0 && (
                <div className="mt-3 flex items-center text-sm text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  {complaint.proofFiles.length} file(s) attached
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Complaint Details
                </h3>
                <button
                  onClick={closeComplaintModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Complaint ID</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.complaintId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.email}</p>
                  </div>
                </div>

                {selectedComplaint.mobile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.mobile}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.district}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Complaint</label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedComplaint.complaint}</p>
                </div>

                {selectedComplaint.reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department Response</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedComplaint.reason}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Filed On</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedComplaint.createdAt)}</p>
                </div>

                {selectedComplaint.proofFiles && selectedComplaint.proofFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proof Files</label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedComplaint.proofFiles.map((fileUrl, index) => (
                        <a
                          key={index}
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-blue-600 text-sm"
                        >
                          View File {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

