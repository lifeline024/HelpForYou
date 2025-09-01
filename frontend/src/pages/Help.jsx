import React from "react";
import { 
  FaNetworkWired, FaLock, FaSyncAlt, FaUserCog, FaQuestionCircle, 
  FaTools, FaCogs, FaEnvelope, FaPhoneAlt, FaMobileAlt, FaExclamationTriangle 
} from "react-icons/fa";

export default function HelpPage() {
  return (
    <div className="help-page">
      <header className="help-header">
        <h1>Help & Support</h1>
        <p>Your complete guide to using HelpForYou effectively</p>
      </header>

      {/* Basic Help Section */}
      <section className="help-section">
        <h2><FaQuestionCircle className="icon"/> Basic Usage</h2>
        <ul>
          <li><strong>Creating an Account:</strong> Click on Signup, fill in your details, and verify your email.</li>
          <li><strong>Login:</strong> Use your registered email/mobile and password to login.</li>
          <li><strong>Reset Password:</strong> If you forget your password, click "Forgot Password?" on the login page and follow the instructions.</li>
          <li><strong>Navigation:</strong> Use the top menu to access different sections like Raise Complaint, Your Complaints, Status, Policy, and Help.</li>
        </ul>
      </section>

      {/* Account & Settings Section */}
      <section className="help-section">
        <h2><FaUserCog className="icon"/> Account & Settings</h2>
        <ul>
          <li><strong>Update Profile:</strong> Go to Profile page to update your name, email, phone number, or address.</li>
          <li><strong>Notification Settings:</strong> Enable/disable email notifications for complaint updates.</li>
          <li><strong>Privacy Settings:</strong> Control what information is visible and manage account security.</li>
          <li><strong>Language Preference:</strong> Change app language from settings for easier navigation.</li>
        </ul>
      </section>

      {/* Network & Technical Section */}
      <section className="help-section">
        <h2><FaNetworkWired className="icon"/> Network & Technical Support</h2>
        <ul>
          <li><strong>Connection Issues:</strong> Make sure your internet is stable. Refresh the page if errors occur.</li>
          <li><strong>Browser Compatibility:</strong> Use modern browsers like Chrome, Firefox, or Edge.</li>
          <li><strong>Clear Cache:</strong> If the site behaves unexpectedly, clear your browser cache and cookies.</li>
          <li><strong>Enable Cookies & JavaScript:</strong> Required for full functionality.</li>
          <li><strong>Mobile App:</strong> Ensure you have the latest version installed for smooth performance.</li>
        </ul>
      </section>

      {/* Advanced Tips Section */}
      <section className="help-section">
        <h2><FaTools className="icon"/> Advanced Tips</h2>
        <ul>
          <li><strong>Bulk Complaint Tracking:</strong> Use Your Complaints page to track multiple complaints at once.</li>
          <li><strong>Export Data:</strong> Export complaint data in supported formats (Excel/CSV) if needed.</li>
          <li><strong>Two-Factor Authentication:</strong> Enable for additional account security.</li>
          <li><strong>Browser Extensions:</strong> Avoid using ad blockers that may interfere with website features.</li>
        </ul>
      </section>

      {/* Security Tips Section */}
      <section className="help-section">
        <h2><FaLock className="icon"/> Security Tips</h2>
        <ul>
          <li><strong>Strong Password:</strong> Use a mix of letters, numbers, and symbols for your account password.</li>
          <li><strong>Do Not Share Login:</strong> Your account is personal; never share credentials.</li>
          <li><strong>Logout:</strong> Always logout on shared devices.</li>
          <li><strong>Suspicious Emails:</strong> Do not click on unknown links claiming to be from HelpForYou.</li>
        </ul>
      </section>

      {/* Troubleshooting Section */}
      <section className="help-section">
        <h2><FaExclamationTriangle className="icon"/> Troubleshooting</h2>
        <ul>
          <li><strong>App Crashes:</strong> Restart the app and ensure you have the latest update.</li>
          <li><strong>Form Submission Issues:</strong> Check all required fields and internet connection.</li>
          <li><strong>Slow Performance:</strong> Clear cache, close unused tabs, or switch to a stable network.</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="help-section">
        <h2><FaEnvelope className="icon"/> Contact Support</h2>
        <p>
          For additional assistance, contact our support team:
          <br/>
          <strong>Email:</strong> support@helpforyou.com
          <br/>
          <strong>Phone:</strong> +91 9876543210
          <br/>
          <strong>Website Form:</strong> <a href="/contact">Contact Us</a>
        </p>
      </section>

      {/* Feedback Section */}
      <section className="help-section">
        <h2><FaCogs className="icon"/> Feedback & Suggestions</h2>
        <p>
          Help us improve HelpForYou! Share your feedback through the Contact page or via email. Your suggestions are valuable and help us make the platform better for everyone.
        </p>
      </section>

      <style>{`
        .help-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 25px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          background-color: #f3f4f6;
        }
        .help-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .help-header h1 {
          font-size: 3rem;
          color: #4f46e5;
          margin-bottom: 10px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }
        .help-header p {
          font-size: 1.2rem;
          color: #6b7280;
        }
        .help-section {
          background: #ffffff;
          padding: 30px;
          margin-bottom: 30px;
          border-radius: 15px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .help-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .help-section h2 {
          display: flex;
          align-items: center;
          font-size: 1.7rem;
          color: #3b82f6;
          margin-bottom: 18px;
        }
        .help-section h2 .icon {
          margin-right: 12px;
          color: #4f46e5;
        }
        .help-section ul {
          list-style-type: disc;
          padding-left: 35px;
        }
        .help-section ul li {
          margin-bottom: 12px;
          line-height: 1.8;
        }
        .help-section a {
          color: #4f46e5;
          text-decoration: underline;
        }
        .help-section p {
          font-size: 1rem;
          line-height: 1.7;
        }
        @media (max-width: 768px) {
          .help-page {
            padding: 15px;
          }
          .help-header h1 {
            font-size: 2.2rem;
          }
          .help-section h2 {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
