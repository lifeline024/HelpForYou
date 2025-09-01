import React from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "Police Department",
    image: "https://img.icons8.com/ios-filled/100/ffffff/policeman-male.png",
    banner: "https://img.freepik.com/free-vector/police-station-building-night_107791-20361.jpg",
    link: "/PoliceComplaintHistory",
  },
  {
    id: 2,
    title: "Cyber Crime",
    image: "https://img.icons8.com/ios-filled/100/ffffff/hacker.png",
    banner: "https://img.freepik.com/free-vector/cyber-security-concept_23-2148532223.jpg",
    link: "/your-cyber-complaints",
  },
  {
    id: 3,
    title: "Other Complaints",
    image: "https://img.icons8.com/ios-filled/100/ffffff/task.png",
    banner: "https://img.freepik.com/free-vector/people-making-complaints-illustration_23-2148873957.jpg",
    link: "/your-complaints",
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
    padding: "60px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 38,
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#64748b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 40,
    maxWidth: 1200,
    margin: "0 auto",
  },
  card: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    cursor: "pointer",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    transform: "translateY(-12px) scale(1.03)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
  },
  banner: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },
  content: {
    padding: 25,
    textAlign: "center",
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    margin: "-60px auto 20px",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
  },
  icon: {
    width: 60,
    height: 60,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#475569",
  },
};

export default function ComplaintHistory() {
  const [hoveredId, setHoveredId] = React.useState(null);
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(link);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Complaint History</h1>
        <p style={styles.subtitle}>
          View your all your submitted complaints by department
        </p>
      </div>

      <div style={styles.grid}>
        {services.map(({ id, title, image, banner, link }) => (
          <div
            key={id}
            style={{
              ...styles.card,
              ...(hoveredId === id ? styles.cardHover : {}),
            }}
            onPointerEnter={() => setHoveredId(id)}
            onPointerLeave={() => setHoveredId(null)}
            onClick={() => handleNavigate(link)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNavigate(link)}
          >
            <img src={banner} alt={`${title} banner`} style={styles.banner} />
            <div style={styles.iconWrapper}>
              <img src={image} alt={title} style={styles.icon} />
            </div>
            <div style={styles.content}>
              <h2 style={styles.cardTitle}>{title}</h2>
              <p style={styles.cardSubtitle}>View all submitted complaints</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
