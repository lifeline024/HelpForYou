import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PoliceComplaintHistory.css"; 

const PoliceComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first to view your complaints");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/complaints/my-complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setComplaints(res.data.complaints);
        } else {
          setError("Failed to fetch complaints");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Error loading complaints. Please try again later.");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Resolved":
        return "status-badge status-resolved";
      case "Rejected":
        return "status-badge status-rejected";
      case "Under Processing":
        return "status-badge status-processing";
      case "Received at department":
        return "status-badge status-received";
      case "Unsolved":
        return "status-badge status-unsolved";
      default:
        return "status-badge status-requested";
    }
  };

  if (loading) return (
    <div className="complaints-loading">
      <div className="loading-spinner"></div>
      <span className="loading-text">Loading your complaints...</span>
    </div>
  );

  if (error) return (
    <div className="complaints-container">
      <div className="error-message">
        {error}
      </div>
    </div>
  );

  return (
    <div className="complaints-container">
      <h2 className="complaints-title">My Complaint History</h2>

      {complaints.length === 0 ? (
        <div className="empty-complaints">
          <div className="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="empty-text">You have not submitted any complaints yet.</p>
          <p className="empty-subtext">Your complaint history will appear here once you submit a complaint.</p>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-content">
                <div className="complaint-header">
                  <div>
                    <h3 className="complaint-id">Complaint #{complaint.complaintId}</h3>
                    <p className="complaint-date">
                      Submitted on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="complaint-status">
                    <span className={getStatusBadgeClass(complaint.status)}>
                      {complaint.status}
                    </span>
                  </div>
                </div>

                <div className="complaint-details-grid">
                  <div className="detail-section">
                    <h4 className="detail-title">Personal Details</h4>
                    <p className="detail-item"><strong>Name:</strong> {complaint.name}</p>
                    <p className="detail-item"><strong>Email:</strong> {complaint.email}</p>
                    <p className="detail-item"><strong>Mobile:</strong> {complaint.mobile}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4 className="detail-title">Location Details</h4>
                    <p className="detail-item"><strong>District:</strong> {complaint.district}</p>
                    <p className="detail-item"><strong>Location:</strong> {complaint.location}</p>
                  </div>
                </div>

                <div className="complaint-description">
                  <h4 className="detail-title">Complaint Description</h4>
                  <p className="description-text">{complaint.complaint}</p>
                </div>

                {complaint.reason && (
                  <div className="department-response">
                    <h4 className="detail-title">Department Response</h4>
                    <p className="response-text">{complaint.reason}</p>
                  </div>
                )}

                {complaint.proofFiles && complaint.proofFiles.length > 0 && (
                  <div className="evidence-section">
                    <h4 className="detail-title">Attached Evidence</h4>
                    <div className="evidence-list">
                      {complaint.proofFiles.map((file, index) => (
                        <a 
                          key={index} 
                          href={file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="evidence-link"
                        >
                          <svg className="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                          </svg>
                          View File {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="complaint-footer">
                  <p className="update-date">
                    Last updated: {new Date(complaint.updatedAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  
                  <button 
                    onClick={() => {
                      // Function to download PDF
                      alert('Download feature will be cooming soon!');
                    }}
                    className="download-btn"
                  >
                    <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliceComplaintHistory;