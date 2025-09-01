import { useState } from "react";
import axios from "axios";

function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Background Text */}
      <h1 className="background-text">HelpForYou</h1>

      {/* Main Form Container */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="reset-form">
          {/* Logo/Icon */}
          <div className="form-icon">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="#4f46e5" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" />
            </svg>
          </div>

          <h2 className="form-title">Reset Password</h2>
          <p className="form-subtitle">Enter your email to receive a reset link</p>

          {/* Input Field */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
            <span className="input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#9ca3af" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>Send Reset Link</span>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
              </>
            )}
          </button>

          {/* Message Display */}
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                {message.includes('Error') ? (
                  <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                ) : (
                  <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                )}
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="back-link">
            <a href="/">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              Back to Login
            </a>
          </div>
        </form>
      </div>

      <style>{`
        /* Base Styles */
        .password-reset-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        /* Animated Background */
        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .floating-shapes {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          background: white;
          animation: float 15s infinite ease-in-out;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          left: 80%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          top: 80%;
          left: 20%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          top: 30%;
          left: 70%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(10deg);
          }
          66% {
            transform: translateY(20px) rotate(-10deg);
          }
        }

        /* Background Text */
        .background-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.03);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 2;
        }

        /* Form Container */
        .form-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 0 20px;
        }

        .reset-form {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(0);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .reset-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }

        .form-icon {
          margin-bottom: 20px;
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 30px;
        }

        /* Input Group */
        .input-group {
          position: relative;
          margin-bottom: 25px;
        }

        .form-input {
          width: 100%;
          padding: 16px 16px 16px 45px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          color: #1f2937;
          background: white;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }

        .submit-btn:hover:before {
          left: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn.loading {
          pointer-events: none;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Message */
        .message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .message.success {
          background: #ecfdf5;
          color: #065f46;
        }

        .message.error {
          background: #fef2f2;
          color: #991b1b;
        }

        /* Back Link */
        .back-link {
          margin-top: 25px;
        }

        .back-link a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .back-link a:hover {
          color: #4f46e5;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .background-text {
            font-size: 6rem;
          }
          
          .reset-form {
            padding: 30px 20px;
          }
          
          .form-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default PasswordResetRequest;