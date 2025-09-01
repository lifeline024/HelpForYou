import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Progress steps - updated to match your complaint statuses
const steps = ["Requested", "Received at department", "Under Processing", "Resolved"];

export default function ComplaintStatus() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setComplaint(null);

    const urls = [
      `http://localhost:5000/api/complaints/search/${complaintId.trim()}`,
      `http://localhost:5000/api/cyber-complaints/search/${complaintId.trim()}`
    ];

    try {
      const promises = urls.map((url) => axios.get(url).catch(() => null));
      const responses = await Promise.all(promises);

      let foundComplaint = null;
      for (let res of responses) {
        if (res && res.data && res.data.success && res.data.complaint) {
          foundComplaint = res.data.complaint;
          break;
        }
      }

      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setError("Complaint not found in any department!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // CSS Styles (Inline for JS objects)
  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)",
      minHeight: "100vh",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      color: "#0f5132",
      fontSize: "2.5rem",
      fontWeight: "700",
      textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      marginBottom: "30px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      marginBottom: "20px",
    },
    input: {
      padding: "15px 20px",
      width: "100%",
      maxWidth: "500px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      outline: "none",
      fontSize: "16px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    button: {
      padding: "15px 30px",
      background: "linear-gradient(135deg, #0f5132 0%, #0a3622 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(15, 81, 50, 0.3)",
      transition: "all 0.3s ease",
    },
    error: {
      color: "#e53e3e",
      textAlign: "center",
      padding: "15px",
      background: "#fed7d7",
      borderRadius: "12px",
      margin: "20px 0",
      fontWeight: "500",
    },
    complaintCard: {
      background: "white",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      marginTop: "30px",
      borderLeft: "5px solid #0f5132",
    },
    complaintHeader: {
      color: "#0f5132",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "2px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailRow: {
      display: "flex",
      marginBottom: "15px",
      padding: "12px",
      background: "#f8f9fa",
      borderRadius: "8px",
    },
    detailLabel: {
      fontWeight: "600",
      minWidth: "120px",
      color: "#4a5568",
    },
    detailValue: {
      color: "#2d3748",
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontWeight: "600",
      fontSize: "14px",
    },
    progressContainer: {
      marginTop: "30px",
      padding: "20px",
      background: "#f8f9fa",
      borderRadius: "12px",
    },
    progressHeader: {
      color: "#0f5132",
      marginBottom: "20px",
      textAlign: "center",
    },
    stepsContainer: {
      display: "flex",
      justifyContent: "space-between",
      position: "relative",
      margin: "40px 0",
    },
    step: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 2,
      flex: 1,
    },
    stepIcon: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10px",
      fontSize: "20px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    stepLabel: {
      fontSize: "12px",
      fontWeight: "600",
      textAlign: "center",
      maxWidth: "80px",
    },
    progressLine: {
      position: "absolute",
      top: "25px",
      left: "0",
      right: "0",
      height: "4px",
      background: "#e2e8f0",
      zIndex: 1,
    },
    progressFill: {
      position: "absolute",
      top: "25px",
      left: "0",
      height: "4px",
      background: "#0f5132",
      zIndex: 1,
      transition: "width 1s ease",
    }
  };

  // Get status color based on complaint status
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return { background: "#c6f6d5", color: "#22543d" };
      case "Under Processing":
        return { background: "#bee3f8", color: "#1e4e8c" };
      case "Received at department":
        return { background: "#e9d8fd", color: "#44337a" };
      case "Rejected":
        return { background: "#fed7d7", color: "#742a2a" };
      case "Unsolved":
        return { background: "#fefcbf", color: "#744210" };
      default:
        return { background: "#e2e8f0", color: "#4a5568" };
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!complaint) return 0;
    const currentStep = steps.indexOf(complaint.status);
    return currentStep >= 0 ? (currentStep / (steps.length - 1)) * 100 : 0;
  };

  return (
    <div style={styles.container}>
      {/* 🟢 Internal CSS Extra Add */}
      <style>{`
        /* Input focus glow */
        input:focus {
          border-color: #0f5132 !important;
          box-shadow: 0 0 8px rgba(15,81,50,0.3) !important;
        }
        /* Button hover animation */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0px 8px 15px rgba(15,81,50,0.35) !important;
        }
        /* Error shake */
        .error-box {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.header}
      >
        Track Your Complaint Status
      </motion.h2>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={styles.card}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Your Complaint ID"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            required
            style={styles.input}
          />
          <motion.button
            type="submit"
            disabled={loading}
            style={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Checking Status..." : "Check Status"}
          </motion.button>
        </form>

        {/* Error */}
        {error && (
          <motion.div
            className="error-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.error}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Complaint Details */}
      {complaint && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={styles.complaintCard}
        >
          <div style={styles.complaintHeader}>
            <h3 style={{ margin: 0 }}>Complaint Details</h3>
            <div style={{ ...styles.statusBadge, ...getStatusColor(complaint.status) }}>
              {complaint.status}
            </div>
          </div>

          {/* Cyber Complaint */}
          {complaint.complaintType ? (
            <>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Name:</b> {complaint.name}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Email:</b> {complaint.email}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Phone:</b> {complaint.phone}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Complaint Type:</b> {complaint.complaintType}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Subject:</b> {complaint.subject}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Description:</b> {complaint.description}</div>
            </>
          ) : (
            /* Police Complaint */
            <>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Name:</b> {complaint.name}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Email:</b> {complaint.email}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Mobile:</b> {complaint.mobile}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>District:</b> {complaint.district}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Location:</b> {complaint.location}</div>
              <div style={styles.detailRow}><b style={styles.detailLabel}>Complaint:</b> {complaint.complaint}</div>
            </>
          )}

          {/* Progress Tracker */}
          {steps.includes(complaint.status) && (
            <div style={styles.progressContainer}>
              <h4 style={styles.progressHeader}>Complaint Progress</h4>
              <div style={styles.stepsContainer}>
                <div style={styles.progressLine}></div>
                <div style={{ ...styles.progressFill, width: `${getProgressPercentage()}%` }}></div>
                {steps.map((step, index) => (
                  <motion.div key={index} style={styles.step}>
                    <div
                      style={{
                        ...styles.stepIcon,
                        background: index <= steps.indexOf(complaint.status) ? "#0f5132" : "#e2e8f0",
                        color: index <= steps.indexOf(complaint.status) ? "#fff" : "#a0aec0",
                      }}
                    >
                      {index <= steps.indexOf(complaint.status) ? "✔" : index + 1}
                    </div>
                    <span style={styles.stepLabel}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
