import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const images = [
    "https://i.pinimg.com/1200x/66/b8/19/66b819295dc4e525688927ca8b1f37c7.jpg",
    "https://i.pinimg.com/1200x/ad/56/48/ad56489a88f439f7573fecad15ef176b.jpg",
    "https://i.pinimg.com/736x/3c/e1/b7/3ce1b7cace420085e99829032d7393e5.jpg",
    "https://i.pinimg.com/736x/16/4b/9e/164b9e8e0d2a149ec33e0551f65b703d.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const services = [
    {
      id: 1,
      title: "Police Department",
      image: "https://img.icons8.com/?size=100&id=ZfXbV2l4VXrY&format=png&color=000000",
      link: "/departments/police",
      color: "#3b82f6"
    },
    // {
    //   id: 2,
    //   title: "Environmental Department",
    //   image: "https://img.icons8.com/?size=100&id=RD4Xh0iUC5_C&format=png&color=000000",
    //   link: "/departments/environment",
    //   color: "#10b981"
    // },
    // {
    //   id: 3,
    //   title: "Health Department",
    //   image: "https://img.icons8.com/?size=100&id=xbf6b1s5EnSH&format=png&color=000000",
    //   link: "/departments/health",
    //   color: "#ef4444"
    // },
    // {
    //   id: 4,
    //   title: "Government & Administration",
    //   image: "https://img.icons8.com/?size=100&id=43399&format=png&color=000000",
    //   link: "/departments/government",
    //   color: "#8b5cf6"
    // },
    {
      id: 5,
      title: "Cyber Crime",
      image: "https://img.icons8.com/?size=100&id=l4eFWADRI3wG&format=png&color=000000",
      link: "/departments/cybercrime",
      color: "#f59e0b"
    }
    // ,
    // {
    //   id: 6,
    //   title: "Other Complaints",
    //   image: "https://img.icons8.com/?size=100&id=h3AiB0czCJSM&format=png&color=000000",
    //   link: "/departments/others",
    //   color: "#6366f1"
    // }
  ];

  const processSteps = [
    { id: 1, title: "Report Your Issue", description: "Submit your complaint with details and any supporting evidence.", icon: "📝" },
    { id: 2, title: "Verification", description: "Our team verifies the complaint while keeping your identity anonymous.", icon: "🔍" },
    { id: 3, title: "Action Taken", description: "We escalate the issue to the relevant authorities for resolution.", icon: "⚡" },
    { id: 4, title: "Resolution & Updates", description: "Track the progress and get updates until the complaint is resolved.", icon: "✅" }
  ];

  return (
    <div className="home-container">
      {/* Warning Banner */}
      <div className="warning-banner">
        <div className="warning-content">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            Caution: Please submit only genuine complaints. Fake, abusive, or offensive complaints will be rejected. Do not share personal passwords, bank details, or private information. Misuse of this platform may lead to account suspension or legal action.
          </span>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slider" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${images[currentIndex]})` }}>
          <div className="container">
            <div className="hero-content">
              <h1>Your Voice Against Injustice</h1>
              <p>Report crimes, complaints, and issues anonymously. Get guaranteed response within 24-48 hours.</p>
              <div className="hero-buttons">
                <Link to="/check-complaint-status" className="cta-button primary">Check Complaint Status</Link>
                <Link to="/file-complaint" className="cta-button secondary">File a Complaint</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Report Your Complaint</h2>
            <p className="section-subtitle">Select the category that best matches your issue</p>
          </div>
          <div className="services-grid">
            {services.map(service => (
              <Link key={service.id} to={service.link} className="service-card">
                <div className="service-icon" style={{ backgroundColor: service.color }}>
                  <img src={service.image} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <h3>10,000+</h3>
              <p>Complaints Resolved</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <h3>24-48h</h3>
              <p>Response Time</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <h3>50+</h3>
              <p>Active Volunteers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p className="section-subtitle">Our streamlined process ensures your voice is heard and your issues are resolved</p>
          </div>
          <div className="process-grid">
            {processSteps.map(step => (
              <div key={step.id} className="process-card">
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Your report can help create a safer community for everyone</p>
            <Link to="/file-complaint" className="cta-button primary">File a Complaint Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}