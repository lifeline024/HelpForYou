import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, FileText, Download, Clock, User, Mail, Phone, MapPin, AlertCircle, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyCyberComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your complaints");
        setLoading(false);
        return;
      }
      const res = await fetch(
        "http://localhost:5000/api/cyber-complaints/my-complaints",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setComplaints(data.complaints);
      else toast.error(data.message || "Failed to fetch complaints");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const statusColors = {
      'Requested': { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb' },
      'Resolved': { bg: '#e8f5e9', text: '#2e7d32', border: '#c8e6c9' },
      'Rejected': { bg: '#ffebee', text: '#c62828', border: '#ffcdd2' },
      'Unsolved': { bg: '#fff3e0', text: '#ef6c00', border: '#ffe0b2' },
      'Received at department': { bg: '#f3e5f5', text: '#7b1fa2', border: '#e1bee7' },
      'Under Processing': { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb' }
    };
    return statusColors[status] || { bg: '#f5f5f5', text: '#616161', border: '#e0e0e0' };
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Requested': <Clock size={14} />,
      'Resolved': <Shield size={14} />,
      'Rejected': <X size={14} />,
      'Unsolved': <AlertCircle size={14} />,
      'Received at department': <FileText size={14} />,
      'Under Processing': <Clock size={14} />
    };
    return statusIcons[status] || <AlertCircle size={14} />;
  };

  const downloadComplaintPDF = async (complaintId) => {
    toast.success(`Downloading complaint ${complaintId}...`);
    // PDF download functionality would be implemented here
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading your cyber complaints...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <Shield size={32} />
            </div>
            <div>
              <h1 style={styles.title}>My Cyber Complaints</h1>
              <p style={styles.subtitle}>Track and manage all your cyber crime complaints</p>
            </div>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{complaints.length}</span>
              <span style={styles.statLabel}>Total Complaints</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>
                {complaints.filter(c => c.status === 'Resolved').length}
              </span>
              <span style={styles.statLabel}>Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by complaint ID or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterButton,
              ...(filterStatus === 'all' ? styles.filterButtonActive : {})
            }}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          {['Requested', 'Under Processing', 'Resolved', 'Rejected'].map(status => (
            <button
              key={status}
              style={{
                ...styles.filterButton,
                ...(filterStatus === status ? styles.filterButtonActive : {})
              }}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Grid */}
      <div style={styles.complaintsGrid}>
        {filteredComplaints.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No complaints found</h3>
            <p style={styles.emptyText}>
              {complaints.length === 0 
                ? "You haven't submitted any cyber complaints yet."
                : "No complaints match your search criteria."}
            </p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <motion.div
              key={complaint._id}
              style={styles.complaintCard}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedComplaint(complaint)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.complaintId}>#{complaint.complaintId}</div>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(complaint.status).bg,
                  color: getStatusColor(complaint.status).text,
                  border: `1px solid ${getStatusColor(complaint.status).border}`
                }}>
                  {getStatusIcon(complaint.status)}
                  <span style={styles.statusText}>{complaint.status}</span>
                </div>
              </div>
              
              <h3 style={styles.complaintSubject}>{complaint.subject}</h3>
              <p style={styles.complaintDescription}>
                {complaint.description.length > 120 
                  ? `${complaint.description.substring(0, 120)}...` 
                  : complaint.description}
              </p>
              
              <div style={styles.cardFooter}>
                <div style={styles.dateInfo}>
                  <Clock size={14} style={styles.footerIcon} />
                  <span style={styles.dateText}>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.viewDetails}>
                  <span style={styles.viewDetailsText}>View Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setSelectedComplaint(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Complaint Details</h2>
                <button
                  style={styles.closeButton}
                  onClick={() => setSelectedComplaint(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Complaint Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Complaint ID</span>
                      <span style={styles.detailValue}>#{selectedComplaint.complaintId}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Status</span>
                      <span style={{
                        ...styles.statusPill,
                        backgroundColor: getStatusColor(selectedComplaint.status).bg,
                        color: getStatusColor(selectedComplaint.status).text
                      }}>
                        {selectedComplaint.status}
                      </span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Subject</span>
                      <span style={styles.detailValue}>{selectedComplaint.subject}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Type</span>
                      <span style={styles.detailValue}>{selectedComplaint.complaintType}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Submitted On</span>
                      <span style={styles.detailValue}>
                        {new Date(selectedComplaint.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Last Updated</span>
                      <span style={styles.detailValue}>
                        {new Date(selectedComplaint.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Personal Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <User size={16} style={styles.detailIcon} />
                      <span style={styles.detailValue}>{selectedComplaint.name}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <Mail size={16} style={styles.detailIcon} />
                      <span style={styles.detailValue}>{selectedComplaint.email}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <Phone size={16} style={styles.detailIcon} />
                      <span style={styles.detailValue}>{selectedComplaint.phone}</span>
                    </div>
                    {selectedComplaint.address && (
                      <div style={styles.detailItem}>
                        <MapPin size={16} style={styles.detailIcon} />
                        <span style={styles.detailValue}>{selectedComplaint.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Complaint Description</h3>
                  <div style={styles.descriptionBox}>
                    {selectedComplaint.description}
                  </div>
                </div>

                {selectedComplaint.reason && (
                  <div style={styles.modalSection}>
                    <h3 style={styles.sectionTitle}>Department Response</h3>
                    <div style={styles.responseBox}>
                      {selectedComplaint.reason}
                    </div>
                  </div>
                )}

                {selectedComplaint.evidenceFiles && selectedComplaint.evidenceFiles.length > 0 && (
                  <div style={styles.modalSection}>
                    <h3 style={styles.sectionTitle}>Attached Evidence</h3>
                    <div style={styles.filesList}>
                      {selectedComplaint.evidenceFiles.map((file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.fileLink}
                        >
                          <FileText size={16} style={styles.fileIcon} />
                          <span style={styles.fileName}>Evidence {index + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={styles.downloadButton}
                  onClick={() => downloadComplaintPDF(selectedComplaint.complaintId)}
                >
                  <Download size={18} />
                  Download PDF
                </button>
                <button
                  style={styles.closeModalButton}
                  onClick={() => setSelectedComplaint(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '24px',
    fontFamily: '"Inter", "Segoe UI", sans-serif'
  },
  header: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  headerIcon: {
    background: 'linear-gradient(135deg, #0f5132 0%, #0a3622 100%)',
    padding: '16px',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '4px 0 0 0'
  },
  headerStats: {
    display: 'flex',
    gap: '16px'
  },
  statCard: {
    background: '#f8f9fa',
    padding: '16px 20px',
    borderRadius: '12px',
    textAlign: 'center',
    minWidth: '100px'
  },
  statNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f5132'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px'
  },
  filtersContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center'
  },
  searchBox: {
    position: 'relative',
    flex: '1',
    minWidth: '300px'
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterButton: {
    padding: '8px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  filterButtonActive: {
    background: '#0f5132',
    borderColor: '#0f5132',
    color: 'white'
  },
  complaintsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  complaintCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  complaintId: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusText: {
    fontSize: '12px'
  },
  complaintSubject: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0',
    lineHeight: '1.4'
  },
  complaintDescription: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: '0 0 20px 0'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#9ca3af',
    fontSize: '14px'
  },
  footerIcon: {
    color: '#9ca3af'
  },
  dateText: {
    fontSize: '14px'
  },
  viewDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#0f5132',
    fontSize: '14px',
    fontWeight: '500'
  },
  viewDetailsText: {
    fontSize: '14px'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #0f5132',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0'
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: '1000'
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #f3f4f6'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBody: {
    padding: '24px',
    overflow: 'auto',
    flex: '1'
  },
  modalSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 16px 0'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  detailLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '16px',
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  detailIcon: {
    color: '#6b7280'
  },
  statusPill: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
    width: 'fit-content'
  },
  descriptionBox: {
    background: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#374151'
  },
  responseBox: {
    background: '#e8f5e9',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#2e7d32',
    border: '1px solid #c8e6c9'
  },
  filesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  fileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    color: '#0f5132',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  fileIcon: {
    color: '#0f5132'
  },
  fileName: {
    fontSize: '14px'
  },
  modalFooter: {
    padding: '24px',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#0f5132',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  closeModalButton: {
    padding: '12px 20px',
    background: 'white',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default MyCyberComplaints;

// Add CSS animation
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #0f5132 !important;
    outline: none;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  a:hover {
    background-color: #e9ecef !important;
  }
`;
document.head.appendChild(styleElement);