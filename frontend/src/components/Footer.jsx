import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <h2>HelpForYou</h2>
            <p>&copy; {new Date().getFullYear()} HelpForYou. All rights reserved.</p>
            <p>Contact: <a href="mailto:helpforyou@example.com">helpforyou@example.com</a></p>
          </div>
          <div className="footer-right">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">🌐</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .footer {
          background-color: #1a1a1a;
          color: #f0f0f0;
          padding: 40px 20px;
          font-family: 'Arial', sans-serif;
          border-top: 3px solid #4caf50;
        }

        .footer-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          max-width: 1200px;
          margin: auto;
          flex-wrap: wrap;
        }

        .footer-left h2 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #4caf50;
        }

        .footer-left p, .footer-left a {
          font-size: 16px;
          margin: 5px 0;
          color: #ccc;
          text-decoration: none;
        }

        .footer-left a:hover {
          color: #4caf50;
          text-decoration: underline;
        }

        .footer-right h3 {
          font-size: 20px;
          margin-bottom: 10px;
          color: #4caf50;
        }

        .social-icons a {
          display: inline-block;
          margin-right: 15px;
          font-size: 24px;
          transition: transform 0.3s, color 0.3s;
        }

        .social-icons a:hover {
          color: #4caf50;
          transform: scale(1.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
            text-align: center;
          }

          .footer-left, .footer-right {
            margin-bottom: 20px;
          }

          .social-icons a {
            margin-right: 10px;
          }
        }
      `}</style>
    </>
  );
}
