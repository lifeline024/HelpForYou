import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ComplaintForm.css";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    district: "",
    location: "",
    complaint: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Bihar districts for the dropdown
  const biharDistricts = [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", 
    "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", 
    "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani",
    "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa",
    "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul",
    "Vaishali", "West Champaran"
  ];

  // Crime statistics data
  const crimeStats = [
    { type: "Cyber Crime", increase: "25%", icon: "fas fa-laptop-code" },
    { type: "Property Disputes", increase: "18%", icon: "fas fa-home" },
    { type: "Public Harassment", increase: "22%", icon: "fas fa-users" },
    { type: "Financial Fraud", increase: "30%", icon: "fas fa-chart-line" }
  ];

  // 🔥 Auto Location Detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${lat}, Lng: ${lng}`,
          }));
        },
        () => {
          console.warn("Location access denied by user");
        }
      );
    }
  }, []);

  // Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File Change
  const handleFileChange = (e) => {
    // Convert FileList to Array
    setFiles(Array.from(e.target.files));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      alert("You must login first!");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const sendData = new FormData();

      Object.keys(formData).forEach((key) => sendData.append(key, formData[key]));

      files.forEach((file) => sendData.append("proofFiles", file));

      const res = await axios.post(
        "http://localhost:5000/api/complaints/create",
        sendData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaintId(res.data.complaint.complaintId);
      setShowSuccessDialog(true);
      
      setFormData({
        name: "",
        email: "",
        mobile: "",
        district: "",
        location: "",
        complaint: "",
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert(
        "Failed to submit complaint: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setShowSuccessDialog(false);
  };

  // Auto-rotate crime stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % crimeStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="complaint-portal-container">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="success-dialog-overlay">
          <div className="success-dialog">
            <div className="dialog-header">
              <i className="fas fa-check-circle"></i>
              <h3>Complaint Registered Successfully!</h3>
            </div>
            <div className="dialog-body">
              <p className="complaint-id">Complaint ID: <span>{complaintId}</span></p>
              <p className="confirmation-message">
                Complaint details have been sent to your registered email ID.
                You can use the Complaint ID to track the status of your complaint.
              </p>
            </div>
            <div className="dialog-footer">
              <button onClick={closeDialog} className="dialog-btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="portal-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="government-logo">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="titles">
              <h1>HelpForYou</h1>
              <h2>Public Complaint Portal</h2>
            </div>
          </div>
          <div className="header-graphic">
            <div className="graphic-icon">
              <i className="fas fa-gavel"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="alert-banner">
        <div className="alert-content">
          <i className="fas fa-exclamation-triangle"></i>
          <div className="alert-text">
            <span className="alert-title">Crime Alert:</span>
            <span className="alert-message">
              {crimeStats[currentSlide].type} increased by {crimeStats[currentSlide].increase} this year. Report any incidents immediately!
            </span>
          </div>
          <i className={crimeStats[currentSlide].icon}></i>
        </div>
      </div>

      <div className="main-content-wrapper">
        <div className="container main-content">
          <div className="content-grid">
            {/* Left side content */}
            <div className="left-content">
              <div className="info-card">
                <h2>How to Register a Complaint</h2>
                <ol>
                  <li>Fill in your personal details</li>
                  <li>Select your district from the dropdown</li>
                  <li>Verify your location (automatically detected)</li>
                  <li>Describe your complaint in detail</li>
                  <li>Attach any supporting documents</li>
                  <li>Submit the form</li>
                </ol>
              </div>

              <div className="info-card">
                <h2>Why Register Here?</h2>
                <ul>
                  <li>Direct access to government officials</li>
                  <li>Quick resolution guaranteed</li>
                  <li>Transparent tracking system</li>
                  <li>Secure and confidential</li>
                </ul>
              </div>

              <div className="emergency-contact">
                <h3>Emergency Contacts</h3>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <p>For urgent matters, call: <strong>1911</strong></p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-female"></i>
                  <p>Women Helpline: <strong>181</strong></p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-child"></i>
                  <p>Child Helpline: <strong>1098</strong></p>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="form-content">
              <div className="complaint-form-card">
                <div className="form-header">
                  <h2 className="form-title">
                    <i className="fas fa-edit"></i> Register Your Complaint
                  </h2>
                  <div className="form-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Mobile Number</label>
                        <input
                          type="text"
                          name="mobile"
                          className="form-control"
                          value={formData.mobile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>District *</label>
                        <select
                          name="district"
                          className="form-select"
                          value={formData.district}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select District</option>
                          {biharDistricts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      placeholder="Location (auto detected or enter manually)"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                    <small className="location-help">
                      <i className="fas fa-info-circle"></i> Your location is automatically detected. 
                      You can edit if needed.
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Complaint Details *</label>
                    <textarea
                      name="complaint"
                      className="form-control"
                      rows="5"
                      placeholder="Please describe your complaint in detail..."
                      value={formData.complaint}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Attach Supporting Documents (Optional)</label>
                    <div className="file-upload-wrapper">
                      <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange}
                        className="form-control"
                        id="fileUpload"
                      />
                      <label htmlFor="fileUpload" className="file-upload-label">
                        <i className="fas fa-cloud-upload-alt"></i> Choose Files
                      </label>
                    </div>
                    <small className="file-help">
                      You can upload multiple files (images, documents, etc.)
                    </small>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Complaint
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Process Flow Section */}
          <div className="process-flow">
            <h2 className="section-title">Our Complaint Resolution Process</h2>
            <div className="process-steps">
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <h4>Apply</h4>
                <p>Register your complaint through our portal</p>
              </div>
              
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h4>Approved</h4>
                <p>Complaint verified and approved</p>
              </div>
              
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h4>Verification</h4>
                <p>Our team verifies the details</p>
              </div>
              
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <h4>Action Taken</h4>
                <p>Appropriate action initiated</p>
              </div>
              
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-check-double"></i>
                </div>
                <h4>Resolved</h4>
                <p>Complaint successfully resolved</p>
              </div>
            </div>
            
            <div className="time-guarantee">
              <i className="fas fa-clock"></i>
              <h3>Quick Resolution Guaranteed Within 24-48 Hours!</h3>
              <p>Our dedicated team works round the clock to ensure your complaints are addressed promptly</p>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}