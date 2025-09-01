import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Clock
} from "lucide-react";

export default function UpdateComplaint() {
  // 🔑 Password Lock States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Complaint States
  const [complaintId, setComplaintId] = useState("");
  const [complaintData, setComplaintData] = useState(null);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const validStatuses = [
    "Requested",
    "Received at department",
    "Under Processing",
    "Resolved",
    "Rejected",
    "Unsolved",
  ];

  // Function to generate password based on current system time
  const getCurrentPassword = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return hours + minutes; // e.g. "1045"
  };

  const handleUnlock = () => {
    if (inputPassword === getCurrentPassword()) {
      setIsUnlocked(true);
      setPasswordError("");
    } else {
      setPasswordError(" ! Wrong Code !");
    }
  };

  // 🔍 Fetch complaint by ID
  const fetchComplaint = async () => {
    if (!complaintId.trim()) {
      setError("Please enter a Complaint ID");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let res;
      let complaintType = "";

      try {
        res = await axios.get(
          `http://localhost:5000/api/complaints/search/${complaintId.trim()}`
        );
        complaintType = "police";
      } catch (policeError) {
        try {
          res = await axios.get(
            `http://localhost:5000/api/cyber-complaints/search/${complaintId.trim()}`
          );
          complaintType = "cyber";
        } catch (cyberError) {
          throw new Error("Complaint not found in either system");
        }
      }

      const data = res.data.complaint;
      data.complaintType = complaintType;
      setComplaintData(data);
      setStatus(data.status || "");
      setReason(data.reason || "");
    } catch (err) {
      console.error(err);
      setError("Complaint not found! Please check the Complaint ID");
      setComplaintData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update status
  const handleUpdate = async () => {
    if (!status) {
      setError("Please select a status");
      return;
    }
    if (!complaintData) return;

    setUpdating(true);
    setError("");

    try {
      let url = "";
      if (complaintData.complaintType === "police") {
        url = `http://localhost:5000/api/complaints/update-status/${complaintId}`;
      } else {
        url = `http://localhost:5000/api/cyber-complaints/update-status/${complaintId}`;
      }

      const token = localStorage.getItem("token");
      await axios.put(
        url,
        { status, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComplaint();
      alert("Status updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Error updating status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    setComplaintId("");
    setComplaintData(null);
    setStatus("");
    setReason("");
    setError("");
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Requested: "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      "Under Processing": "bg-yellow-100 text-yellow-800",
      "Received at department": "bg-purple-100 text-purple-800",
      Unsolved: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  // If not unlocked, show password screen
  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Verification</h2>
          <p className="text-gray-600 mb-6">This page is protected by Department</p>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Security Code</label>
              {/* <p className="text-sm text-blue-800 flex items-center justify-center">
              <Clock className="w-4 h-4 mr-2" />
              <strong>Current Time: </strong> {new Date().toLocaleTimeString()}
            </p> */}
            </div>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value.replace(/\D/g, '').slice(0, 4));
                setPasswordError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0000"
              maxLength={4}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
            />
            
            {passwordError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Unlock Access
          </button>
        </div>
      </div>
    );
  }

  // 🔓 If unlocked, show the complaint update form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Lock Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mb-4 relative">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Update Complaint Status
          </h1>
          <p className="text-gray-600">
            Search for complaints by ID and update their status
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter Complaint ID"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && fetchComplaint()}
                />
              </div>
            </div>
            <button
              onClick={fetchComplaint}
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Complaint
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Complaint Details & Update Form */}
        {complaintData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Complaint Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Complaint Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Complaint ID</p>
                      <p className="font-medium text-gray-900">{complaintData.complaintId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaintData.status)}`}>
                      {complaintData.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Complaint Type</p>
                    <p className="font-medium text-gray-900 capitalize">{complaintData.complaintType}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium text-gray-900">{complaintData.subject || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                      {complaintData.description || complaintData.complaint || 'No description provided'}
                    </p>
                  </div>

                  {complaintData.reason && (
                    <div>
                      <p className="text-sm text-gray-500">Current Reason</p>
                      <p className="text-gray-700 mt-1 bg-blue-50 p-3 rounded-lg">
                        {complaintData.reason}
                      </p>
                    </div>
                  )}

                  {/* Complainant Information */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Complainant Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{complaintData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {complaintData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {complaintData.phone || complaintData.mobile || 'N/A'}
                        </p>
                      </div>
                      {(complaintData.address || complaintData.location) && (
                        <div>
                          <p className="text-sm text-gray-500">Address/Location</p>
                          <p className="font-medium text-gray-900 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {complaintData.address || complaintData.location || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional fields for police complaints */}
                  {complaintData.district && (
                    <div>
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium text-gray-900">{complaintData.district}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Update Status
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select Status</option>
                      {validStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      rows={4}
                      placeholder="Enter reason for status update..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={updating || !status}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      {updating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Update Status
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!complaintData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">How to use</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Enter the Complaint ID to search for a specific complaint</li>
                    <li>Both police and cyber complaints are supported</li>
                    <li>Update the status and add a reason for the status change</li>
                    <li>The complainant will receive an email notification about the update</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}