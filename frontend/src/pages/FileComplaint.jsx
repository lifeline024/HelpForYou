import React, { useState } from "react";
import { Link } from "react-router-dom";

const DepartmentsPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const departments = [
    {
      id: 1,
      title: "Police Department",
      image: "https://img.icons8.com/?size=100&id=ZfXbV2l4VXrY&format=png&color=000000",
      link: "/departments/police",
      description: "Ensuring public safety, maintaining law and order, and preventing crime in our community.",
      services: [
        "Emergency response services",
        "Crime prevention programs",
        "Traffic control and management",
        "Community policing initiatives"
      ],
      stats: "Handles over 5,000 cases monthly with 95% resolution rate",
      contact: "Emergency: 100 | Non-emergency: 1234567890"
    },
    // {
    //   id: 2,
    //   title: "Environmental Department",
    //   image: "https://img.icons8.com/?size=100&id=RD4Xh0iUC5_C&format=png&color=000000",
    //   link: "/departments/environment",
    //   description: "Protecting our natural resources, promoting sustainability, and ensuring a clean environment for all citizens.",
    //   services: [
    //     "Pollution control and monitoring",
    //     "Waste management programs",
    //     "Environmental conservation projects",
    //     "Green initiative promotions"
    //   ],
    //   stats: "Planted 50,000+ trees in the last year across the state",
    //   contact: "Environment Helpline: 1800-123-4567"
    // },
    // {
    //   id: 3,
    //   title: "Health Department",
    //   image: "https://img.icons8.com/?size=100&id=xbf6b1s5EnSH&format=png&color=000000",
    //   link: "/departments/health",
    //   description: "Dedicated to improving public health, providing medical services, and ensuring healthcare accessibility.",
    //   services: [
    //     "Public health programs",
    //     "Hospital and clinic management",
    //     "Disease prevention and control",
    //     "Health education and awareness"
    //   ],
    //   stats: "Serves over 2 million patients annually through 500+ facilities",
    //   contact: "Health Helpline: 104 | Ambulance: 108"
    // },
    // {
    //   id: 4,
    //   title: "Government & Administration",
    //   image: "https://img.icons8.com/?size=100&id=43399&format=png&color=000000",
    //   link: "/departments/government",
    //   description: "Managing public administration, governance, and ensuring efficient delivery of government services.",
    //   services: [
    //     "Public service delivery",
    //     "Administrative oversight",
    //     "Policy implementation",
    //     "Citizen grievance redressal"
    //   ],
    //   stats: "Processes over 10,000 citizen requests daily with 48-hour average resolution time",
    //   contact: "Citizen Helpdesk: 1800-180-1551"
    // },
    {
      id: 5,
      title: "Cyber Crime Department",
      image: "https://img.icons8.com/?size=100&id=l4eFWADRI3wG&format=png&color=000000",
      link: "/departments/cybercrime",
      description: "Combating cyber threats, preventing online fraud, and ensuring digital safety for all citizens.",
      services: [
        "Cyber crime investigation",
        "Digital fraud prevention",
        "Cybersecurity awareness programs",
        "Online harassment complaint resolution"
      ],
      stats: "Prevented financial losses of over ₹50 crores in the last year",
      contact: "Cyber Crime Helpline: 1930 | Email: cybercell@state.gov.in"
    }
    // ,
    // {
    //   id: 6,
    //   title: "Other Complaints",
    //   image: "https://img.icons8.com/?size=100&id=h3AiB0czCJSM&format=png&color=000000",
    //   link: "/departments/others",
    //   description: "Addressing all other public grievances and complaints not covered by specialized departments.",
    //   services: [
    //     "General complaint resolution",
    //     "Inter-departmental coordination",
    //     "Public utility issues",
    //     "Miscellaneous citizen services"
    //   ],
    //   stats: "Resolves 15,000+ miscellaneous complaints monthly with 90% satisfaction rate",
    //   contact: "General Helpline: 1551 | Email: grievances@state.gov.in"
    // }
  ];

  const openDetailModal = (dept) => {
    setSelectedDepartment(dept);
  };

  const closeDetailModal = () => {
    setSelectedDepartment(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>HelpForYou Portal</h1>
        <p style={styles.heroSubtitle}>
          Your one-stop platform to connect with various HelpForYou and services. 
          We're committed to resolving your concerns efficiently and transparently.
        </p>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <h3>2.5M+</h3>
            <p>Citizens Served</p>
          </div>
          <div style={styles.statItem}>
            <h3>95%</h3>
            <p>Resolution Rate</p>
          </div>
          <div style={styles.statItem}>
            <h3>24-48h</h3>
            <p>Average Resolution Time</p>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Select a Department to File Your Complaint</h2>
        <p style={styles.sectionDescription}>
          Our dedicated departments work round the clock to address your concerns. 
          Choose the relevant department below to register your complaint or seek assistance.
        </p>

        <div style={styles.departmentsGrid}>
          {departments.map((dept) => (
            <div key={dept.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <img 
                  src={dept.image} 
                  alt={dept.title} 
                  style={styles.cardImage}
                />
                <h3 style={styles.cardTitle}>{dept.title}</h3>
              </div>
              <p style={styles.cardDescription}>{dept.description}</p>
              <div style={styles.cardActions}>
                <Link to={dept.link} style={styles.primaryButton}>
                  File Complaint
                </Link>
                <button 
                  onClick={() => openDetailModal(dept)}
                  style={styles.secondaryButton}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Why Choose Our Portal?</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🔒</div>
              <h3>Secure & Confidential</h3>
              <p>Your complaints and personal information are protected with advanced security measures.</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>⚡</div>
              <h3>Quick Resolution</h3>
              <p>Most complaints are resolved within 24-48 hours through our efficient system.</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>📱</div>
              <h3>Easy Tracking</h3>
              <p>Monitor your complaint status in real-time with our tracking system.</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🌐</div>
              <h3>24/7 Accessibility</h3>
              <p>Access our services anytime, anywhere through our online platform.</p>
            </div>
          </div>
        </div>

        <div style={styles.testimonialSection}>
          <h2 style={styles.sectionTitle}>What Citizens Say</h2>
          <div style={styles.testimonials}>
            <div style={styles.testimonial}>
              <p style={styles.testimonialText}>
                "I reported a garbage disposal issue in my area, and it was resolved within 24 hours. 
                The system is incredibly efficient!"
              </p>
              <p style={styles.testimonialAuthor}>- Rajesh Kumar, Patna</p>
            </div>
            <div style={styles.testimonial}>
              <p style={styles.testimonialText}>
                "The cyber crime department helped me recover my lost money from an online scam. 
                Thank you for your prompt action!"
              </p>
              <p style={styles.testimonialAuthor}>- Priya Singh, Gaya</p>
            </div>
            <div style={styles.testimonial}>
              <p style={styles.testimonialText}>
                "I've filed multiple complaints through this portal, and each time the response 
                has been quick and effective. Great initiative!"
              </p>
              <p style={styles.testimonialAuthor}>- Amit Sharma, Muzaffarpur</p>
            </div>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <h2>Have a General Inquiry?</h2>
          <p>Can't find the right department? Contact our general support team for assistance.</p>
          <div style={styles.ctaButtons}>
            <a href="tel:1551" style={styles.ctaButton}>
              Call Support: 1551
            </a>
            <a href="mailto:support@govportal.com" style={styles.ctaButtonSecondary}>
              Email Us
            </a>
          </div>
        </div>
      </div>

      {/* Department Detail Modal */}
      {selectedDepartment && (
        <div style={styles.modalOverlay} onClick={closeDetailModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeDetailModal}>
              ×
            </button>
            
            <div style={styles.modalHeader}>
              <img 
                src={selectedDepartment.image} 
                alt={selectedDepartment.title} 
                style={styles.modalImage}
              />
              <h2 style={styles.modalTitle}>{selectedDepartment.title}</h2>
            </div>
            
            <p style={styles.modalDescription}>{selectedDepartment.description}</p>
            
            <div style={styles.modalSection}>
              <h3>Services Offered</h3>
              <ul style={styles.servicesList}>
                {selectedDepartment.services.map((service, index) => (
                  <li key={index} style={styles.serviceItem}>{service}</li>
                ))}
              </ul>
            </div>
            
            <div style={styles.modalSection}>
              <h3>Department Statistics</h3>
              <p style={styles.modalStats}>{selectedDepartment.stats}</p>
            </div>
            
            <div style={styles.modalSection}>
              <h3>Contact Information</h3>
              <p style={styles.modalContact}>{selectedDepartment.contact}</p>
            </div>
            
            <div style={styles.modalActions}>
              <Link 
                to={selectedDepartment.link} 
                style={styles.modalPrimaryButton}
                onClick={closeDetailModal}
              >
                File a Complaint
              </Link>
              <button 
                style={styles.modalSecondaryButton}
                onClick={closeDetailModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  heroSection: {
    background: "linear-gradient(135deg, #0f5132 0%, #0a3622 100%)",
    color: "white",
    padding: "60px 20px",
    textAlign: "center"
  },
  heroTitle: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    fontWeight: "700"
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    maxWidth: "800px",
    margin: "0 auto 40px",
    lineHeight: "1.6",
    opacity: "0.9"
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "30px"
  },
  statItem: {
    textAlign: "center"
  },
  statItemH3: {
    fontSize: "2.5rem",
    margin: "0 0 10px"
  },
  statItemP: {
    margin: "0",
    opacity: "0.8"
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px"
  },
  sectionTitle: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "20px",
    color: "#0f5132"
  },
  sectionDescription: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#555",
    maxWidth: "800px",
    margin: "0 auto 40px",
    lineHeight: "1.6"
  },
  departmentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "30px",
    marginBottom: "60px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
    padding: "25px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px"
  },
  cardImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
    marginRight: "15px"
  },
  cardTitle: {
    fontSize: "1.4rem",
    margin: "0",
    color: "#0f5132"
  },
  cardDescription: {
    color: "#555",
    lineHeight: "1.6",
    flexGrow: "1",
    marginBottom: "25px"
  },
  cardActions: {
    display: "flex",
    gap: "12px"
  },
  primaryButton: {
    backgroundColor: "#0f5132",
    color: "white",
    padding: "12px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    textAlign: "center",
    flex: "1",
    transition: "background-color 0.3s ease"
  },
  secondaryButton: {
    backgroundColor: "transparent",
    border: "2px solid #0f5132",
    color: "#0f5132",
    padding: "12px 20px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: "1"
  },
  infoSection: {
    margin: "60px 0"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "30px",
    marginTop: "40px"
  },
  feature: {
    textAlign: "center",
    padding: "25px 20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)"
  },
  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "15px"
  },
  featureH3: {
    margin: "0 0 15px",
    color: "#0f5132"
  },
  featureP: {
    color: "#555",
    lineHeight: "1.6",
    margin: "0"
  },
  testimonialSection: {
    margin: "60px 0",
    backgroundColor: "#e9f5ef",
    padding: "50px 20px",
    borderRadius: "12px"
  },
  testimonials: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
    marginTop: "40px"
  },
  testimonial: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)"
  },
  testimonialText: {
    fontStyle: "italic",
    lineHeight: "1.6",
    color: "#444",
    margin: "0 0 15px"
  },
  testimonialAuthor: {
    fontWeight: "600",
    color: "#0f5132",
    margin: "0"
  },
  ctaSection: {
    textAlign: "center",
    backgroundColor: "#0f5132",
    color: "white",
    padding: "50px 20px",
    borderRadius: "12px",
    marginTop: "60px"
  },
  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap"
  },
  ctaButton: {
    backgroundColor: "#ffc107",
    color: "#1e293b",
    padding: "15px 30px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "background-color 0.3s ease"
  },
  ctaButtonSecondary: {
    backgroundColor: "transparent",
    border: "2px solid #ffc107",
    color: "#ffc107",
    padding: "15px 30px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000",
    padding: "20px"
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative"
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.8rem",
    cursor: "pointer",
    color: "#555"
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px"
  },
  modalImage: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
    marginRight: "15px"
  },
  modalTitle: {
    fontSize: "1.8rem",
    margin: "0",
    color: "#0f5132"
  },
  modalDescription: {
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "25px"
  },
  modalSection: {
    marginBottom: "25px"
  },
  servicesList: {
    paddingLeft: "20px",
    margin: "0"
  },
  serviceItem: {
    marginBottom: "8px",
    lineHeight: "1.5",
    color: "#444"
  },
  modalStats: {
    backgroundColor: "#e9f5ef",
    padding: "15px",
    borderRadius: "6px",
    margin: "0",
    fontWeight: "500"
  },
  modalContact: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "6px",
    margin: "0",
    fontWeight: "500"
  },
  modalActions: {
    display: "flex",
    gap: "15px",
    marginTop: "30px"
  },
  modalPrimaryButton: {
    backgroundColor: "#0f5132",
    color: "white",
    padding: "12px 25px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    textAlign: "center",
    flex: "1"
  },
  modalSecondaryButton: {
    backgroundColor: "transparent",
    border: "2px solid #0f5132",
    color: "#0f5132",
    padding: "12px 25px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    flex: "1"
  },
  // Hover effects
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
  },
  primaryButtonHover: {
    backgroundColor: "#0a3622"
  },
  secondaryButtonHover: {
    backgroundColor: "#0f5132",
    color: "white"
  },
  ctaButtonHover: {
    backgroundColor: "#e6ac00"
  },
  ctaButtonSecondaryHover: {
    backgroundColor: "#ffc107",
    color: "#1e293b"
  }
};

// Add hover effects using JavaScript in the component
Object.assign(styles.primaryButton, {
  ':hover': styles.primaryButtonHover
});

Object.assign(styles.secondaryButton, {
  ':hover': styles.secondaryButtonHover
});

Object.assign(styles.ctaButton, {
  ':hover': styles.ctaButtonHover
});

Object.assign(styles.ctaButtonSecondary, {
  ':hover': styles.ctaButtonSecondaryHover
});

Object.assign(styles.card, {
  ':hover': styles.cardHover
});

export default DepartmentsPage;