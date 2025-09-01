import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PasswordReset() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000); // redirect after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
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
      <h1 className="background-text">SecureAccess</h1>

      {/* Main Form Container */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="reset-form">
          {/* Logo/Icon */}
          <div className="form-icon">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="#4f46e5" d="M12,1C8.676,1,6,3.676,6,7v1c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10c0-1.1-0.9-2-2-2V7C18,3.676,15.324,1,12,1z M12,3c2.276,0,4,1.724,4,4v1H8V7C8,4.724,9.724,3,12,3z M12,13c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,13,12,13z"/>
            </svg>
          </div>

          <h2 className="form-title">Set New Password</h2>
          <p className="form-subtitle">Create a strong, secure password</p>

          {/* Password Input Field */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            <span className="input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#9ca3af" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A6,6 0 0,1 24,14A6,6 0 0,1 18,20A6,6 0 0,1 12,14A6,6 0 0,1 18,8M18,10A4,4 0 0,0 14,14A4,4 0 0,0 18,18A4,4 0 0,0 22,14A4,4 0 0,0 18,10M6,8A6,6 0 0,1 12,14A6,6 0 0,1 6,20A6,6 0 0,1 0,14A6,6 0 0,1 6,8M6,10A4,4 0 0,0 2,14A4,4 0 0,0 6,18A4,4 0 0,0 10,14A4,4 0 0,0 6,10Z" />
              </svg>
            </span>
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                {showPassword ? (
                  <path fill="#9ca3af" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                ) : (
                  <path fill="#9ca3af" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                )}
              </svg>
            </button>
          </div>

          {/* Confirm Password Input Field */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="form-input"
              required
            />
            <span className="input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#9ca3af" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A6,6 0 0,1 24,14A6,6 0 0,1 18,20A6,6 0 0,1 12,14A6,6 0 0,1 18,8M18,10A4,4 0 0,0 14,14A4,4 0 0,0 18,18A4,4 0 0,0 22,14A4,4 0 0,0 18,10M6,8A6,6 0 0,1 12,14A6,6 0 0,1 6,20A6,6 0 0,1 0,14A6,6 0 0,1 6,8M6,10A4,4 0 0,0 2,14A4,4 0 0,0 6,18A4,4 0 0,0 10,14A4,4 0 0,0 6,10Z" />
              </svg>
            </span>
          </div>

          {/* Password Strength Indicator */}
          <div className="password-strength">
            <div className="strength-bar">
              <div className={`strength-fill ${password.length > 0 ? (password.length > 8 ? 'strong' : password.length > 5 ? 'medium' : 'weak') : ''}`}></div>
            </div>
            <div className="strength-text">
              {password.length > 0 ? (
                password.length > 8 ? 'Strong password' : password.length > 5 ? 'Medium strength' : 'Weak password'
              ) : 'Enter a password'}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || password !== confirm || password.length === 0}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>Reset Password</span>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M13,19V14H18V10H13V5H11V10H6V14H11V19H13M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2Z" />
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
              Back to Home
            </a>
          </div>
        </form>
      </div>

      <style jsx>{`
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
          max-width: 450px;
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
          margin-bottom: 20px;
        }

        .form-input {
          width: 100%;
          padding: 16px 45px 16px 45px;
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

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Password Strength Indicator */
        .password-strength {
          margin-bottom: 25px;
        }

        .strength-bar {
          height: 6px;
          background-color: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .strength-fill {
          height: 100%;
          width: 0%;
          transition: width 0.3s ease, background-color 0.3s ease;
          border-radius: 3px;
        }

        .strength-fill.weak {
          width: 33%;
          background-color: #ef4444;
        }

        .strength-fill.medium {
          width: 66%;
          background-color: #f59e0b;
        }

        .strength-fill.strong {
          width: 100%;
          background-color: #10b981;
        }

        .strength-text {
          font-size: 12px;
          color: #6b7280;
          text-align: left;
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .submit-btn:not(:disabled):before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }

        .submit-btn:not(:disabled):hover:before {
          left: 100%;
        }

        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
        }

        .submit-btn:not(:disabled):active {
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

export default PasswordReset;