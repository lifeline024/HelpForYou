import React from "react";
import { 
  FaUserShield, FaFileContract, FaClipboardList, FaLock, 
  FaExclamationTriangle, FaEnvelope, FaHandsHelping, FaGavel, 
  FaCookieBite, FaSyncAlt, FaBalanceScale, FaFileAlt 
} from "react-icons/fa";

export default function PolicyPage() {
  return (
    <div className="policy-page">
      <header className="policy-header">
        <h1>HelpForYou Website Policies & Terms</h1>
        <p>Transparent, Secure, and User-Friendly Service Policies</p>
      </header>

      {/* Introduction */}
      <section className="policy-section">
        <h2><FaFileContract className="icon"/> 1. Introduction</h2>
        <p>
          Welcome to <strong>HelpForYou</strong>. By accessing or using our website, you agree to comply with and be bound by the following terms and policies. 
          If you do not agree with any part of this policy, please refrain from using the website.
        </p>
      </section>

      {/* Terms of Use */}
      <section className="policy-section">
        <h2><FaClipboardList className="icon"/> 2. Terms of Use</h2>
        <ul>
          <li><strong>Acceptance of Terms:</strong> By using HelpForYou, you acknowledge that you have read, understood, and agree to abide by these terms.</li>
          <li><strong>Website Purpose:</strong> HelpForYou provides a platform where users can raise complaints, track their status, and access resources.</li>
          <li><strong>Eligibility:</strong> You must be at least 18 years old or have guardian consent.</li>
          <li><strong>Account Responsibility:</strong> Users are responsible for all activities under their account.</li>
          <li><strong>Prohibited Activities:</strong> No spamming, hacking, or illegal activities are allowed.</li>
        </ul>
      </section>

      {/* Privacy Policy */}
      <section className="policy-section">
        <h2><FaUserShield className="icon"/> 3. Privacy Policy</h2>
        <ul>
          <li><strong>Information Collection:</strong> Personal information, complaint data, usage data.</li>
          <li><strong>Use of Information:</strong> To provide services, communicate updates, perform analytics, and comply with regulations.</li>
          <li><strong>Sharing of Information:</strong> Not sold to third parties; may be shared with legal authorities or service providers.</li>
          <li><strong>Data Security:</strong> Industry-standard security, though no system is fully secure.</li>
          <li><strong>Cookies:</strong> Used for login, preferences, analytics, and targeted content.</li>
        </ul>
      </section>

      {/* Complaint Handling Policy */}
      <section className="policy-section">
        <h2><FaHandsHelping className="icon"/> 4. Complaint Handling Policy</h2>
        <ul>
          <li><strong>Submitting Complaints:</strong> Users must submit truthful and accurate complaints.</li>
          <li><strong>Tracking Complaints:</strong> Real-time updates provided where possible.</li>
          <li><strong>Resolution Time:</strong> May vary; no guaranteed timelines.</li>
          <li><strong>User Conduct:</strong> Respectful behavior is mandatory; violations may lead to account suspension.</li>
        </ul>
      </section>

      {/* Intellectual Property & Security */}
      <section className="policy-section">
        <h2><FaLock className="icon"/> 5. Intellectual Property & Security</h2>
        <ul>
          <li><strong>Ownership:</strong> All website content is owned by HelpForYou or its licensors.</li>
          <li><strong>Restrictions:</strong> Copying or redistributing content without permission is prohibited.</li>
          <li><strong>User-Generated Content:</strong> By submitting, you grant a license for service purposes.</li>
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="policy-section">
        <h2><FaExclamationTriangle className="icon"/> 6. Disclaimer</h2>
        <ul>
          <li><strong>No Professional Advice:</strong> Website content is for general information only.</li>
          <li><strong>Accuracy of Information:</strong> We do not guarantee completeness or correctness of content.</li>
          <li><strong>Limitation of Liability:</strong> HelpForYou is not liable for damages arising from use of the website.</li>
        </ul>
      </section>

      {/* Terms & Conditions */}
      <section className="policy-section">
        <h2><FaGavel className="icon"/> 7. Terms & Conditions</h2>
        <ul>
          <li><strong>User Agreement:</strong> By using this website, you agree to comply with all terms, rules, and policies.</li>
          <li><strong>Account Termination:</strong> HelpForYou may suspend or terminate accounts for violation of terms.</li>
          <li><strong>Service Availability:</strong> We strive to keep services online but do not guarantee uninterrupted access.</li>
        </ul>
      </section>

      {/* Refund & Cancellation
      <section className="policy-section">
        <h2><FaSyncAlt className="icon"/> 8. Refund & Cancellation Policy</h2>
        <ul>
          <li><strong>Refund Eligibility:</strong> Refunds may be considered for technical errors or service failures.</li>
          <li><strong>Cancellation:</strong> Users can cancel certain services within defined timelines.</li>
        </ul>
      </section> */}

      {/* Cookie Policy */}
      <section className="policy-section">
        <h2><FaCookieBite className="icon"/> 9. Cookie Policy</h2>
        <ul>
          <li><strong>Types of Cookies:</strong> Session, persistent, and third-party cookies may be used.</li>
          <li><strong>Usage:</strong> Cookies enhance user experience, login persistence, and analytics.</li>
          <li><strong>Consent:</strong> By using the site, users agree to cookie usage.</li>
        </ul>
      </section>

      {/* Governing Law */}
      <section className="policy-section">
        <h2><FaBalanceScale className="icon"/> 10. Governing Law</h2>
        <p>
          These policies and terms are governed by the laws of India. Any disputes arising will be subject to the jurisdiction of local courts.
        </p>
      </section>

      {/* Updates to Policy */}
      <section className="policy-section">
        <h2><FaFileAlt className="icon"/> 11. Updates to Policy</h2>
        <p>
          HelpForYou reserves the right to update these policies and terms at any time. Users are encouraged to review the policies periodically for changes.
        </p>
      </section>

      {/* Contact */}
      <section className="policy-section">
        <h2><FaEnvelope className="icon"/> 12. Contact Information</h2>
        <p>
          For any questions or concerns regarding these policies, contact us at:
          <br/>
          <strong>Email:</strong> support@helpforyou.com
          <br/>
          <strong>Website Form:</strong> <a href="/contact">Contact Us</a>
        </p>
      </section>

      <style>{`
        .policy-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 25px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          background-color: #f3f4f6;
        }
        .policy-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .policy-header h1 {
          font-size: 3rem;
          color: #4f46e5;
          margin-bottom: 10px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }
        .policy-header p {
          font-size: 1.2rem;
          color: #6b7280;
        }
        .policy-section {
          background: #ffffff;
          padding: 30px;
          margin-bottom: 30px;
          border-radius: 15px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .policy-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .policy-section h2 {
          display: flex;
          align-items: center;
          font-size: 1.7rem;
          color: #3b82f6;
          margin-bottom: 18px;
        }
        .policy-section h2 .icon {
          margin-right: 12px;
          color: #4f46e5;
        }
        .policy-section ul {
          list-style-type: disc;
          padding-left: 35px;
        }
        .policy-section ul li {
          margin-bottom: 12px;
          line-height: 1.8;
        }
        .policy-section a {
          color: #4f46e5;
          text-decoration: underline;
        }
        .policy-section p {
          font-size: 1rem;
          line-height: 1.7;
        }
        @media (max-width: 768px) {
          .policy-page {
            padding: 15px;
          }
          .policy-header h1 {
            font-size: 2.2rem;
          }
          .policy-section h2 {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
