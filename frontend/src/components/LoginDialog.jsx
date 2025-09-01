import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import blockchainEncryption from "../utlis/blockchainEncryption";

export default function LoginDialog({ onClose, onShowReset, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      setStep("otp");
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/verify-otp", { email, otp });

      // Encrypt sensitive data before storing
      const encryptedToken = blockchainEncryption.encryptData(res.data.token);
      const encryptedUserData = blockchainEncryption.encryptData({
        _id: res.data._id,
        name: res.data.name,
        role: res.data.role,
        email,
      });

      // ✅ Save encrypted data in localStorage
      localStorage.setItem("token", encryptedToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.name);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userData", encryptedUserData);

      // Log to blockchain simulation
      const ipAddress = await getClientIP();
      await blockchainEncryption.logToBlockchain({
        userId: res.data._id,
        email: email,
        action: 'login',
        timestamp: new Date().toISOString(),
        deviceInfo: navigator.userAgent,
        ip: ipAddress,
        location: 'Detected from IP' // You can enhance this with a geolocation API
      }, 'LOGIN');

      console.log("Login secured with blockchain encryption");
      console.log("Blockchain Logs:", blockchainEncryption.getBlockchainLogs());

      // callback for parent component
      onLoginSuccess(res.data.token, {
        _id: res.data._id,
        name: res.data.name,
        role: res.data.role,
        email,
      });

      onClose();
      window.location.reload();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/resend-otp", { email });
      alert("OTP has been resent to your email!");
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to resend OTP" });
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{step === "login" ? "Welcome Back" : "Verify Your Account"}</h2>
          <p>{step === "login" ? "Sign in to continue" : "Enter the OTP sent to your email"}</p>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        <form onSubmit={step === "login" ? handleLogin : handleVerifyOtp} className="login-form">
          {errors.submit && (
            <div className="error-message submit-error">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          {step === "login" ? (
            <>
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={errors.email ? 'error' : ''}
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#9ca3af" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                  </span>
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={errors.password ? 'error' : ''}
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
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span>Login</span>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M10,17V14H3V10H10V7L15,12L10,17M10,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H10A2,2 0 0,1 8,20V18H10V20H20V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                    </svg>
                  </>
                )}
              </button>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Link to="/department-dashboard">
        <button
          style={{
            backgroundColor: "Red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
          }}
        >
          Department Login
        </button>
      </Link>
    </div>



             <div className="form-footer">
  <Link to="/reset-password-request" className="text-link">
    Forgot Password?
  </Link>
</div>
            </>
          ) : (
            <>
              <div className="otp-notice">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path fill="#4f46e5" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                </svg>
                <p>We've sent a verification code to your email</p>
                <p className="email-display">{email}</p>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (errors.otp) setErrors({ ...errors, otp: "" });
                    }}
                    className={errors.otp ? 'error' : ''}
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#9ca3af" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A6,6 0 0,1 24,14A6,6 0 0,1 18,20A6,6 0 0,1 12,14A6,6 0 0,1 18,8M18,10A4,4 0 0,0 14,14A4,4 0 0,0 18,18A4,4 0 0,0 22,14A4,4 0 0,0 18,10M6,8A6,6 0 0,1 12,14A6,6 0 0,1 6,20A6,6 0 0,1 0,14A6,6 0 0,1 6,8M6,10A4,4 0 0,0 2,14A4,4 0 0,0 6,18A4,4 0 0,0 10,14A4,4 0 0,0 6,10Z" />
                    </svg>
                  </span>
                </div>
                {errors.otp && <span className="error-text">{errors.otp}</span>}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M3,4.27L4.28,3L21,19.72L19.73,21L16.06,17.33C15.44,18 14.54,18.55 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15H9C9,15.39 9.32,15.77 9.86,15.86C10.12,15.28 10.57,14.76 11.19,14.36C10.45,14 9.89,13.37 9.59,12.64L7.55,10.6C7.38,10.87 7.2,11.12 7,11.36C6.57,10.71 6.25,10 6.1,9.23C5.86,8.77 5.5,8.29 5,7.89V11H3V5H9V7H6.47C6.8,6.58 7.2,6.23 7.64,5.93C7.71,5.3 7.89,4.71 8.18,4.18L3,4.27M16.14,13.96C16.68,14.05 17,14.43 17,14.82C17,15.87 15.84,16.59 14.69,16.91L16.14,13.96M13.5,5V2.05C13,2.05 12.5,2 12,2C10.03,2 8.5,3.44 8.09,5.33C8.31,5.38 8.53,5.44 8.75,5.5C9,4.65 9.58,3.89 10.41,3.39C11.07,4.11 12,4.58 13.05,4.85C13.2,4.37 13.36,3.88 13.5,3.4V5M18.93,11.25C19.61,11.03 20.3,10.76 21,10.42V15C21,16.11 20.36,17.23 19.44,17.73C19.17,17.26 18.84,16.84 18.45,16.45C19.31,16.22 20,15.71 20,15H18C18,14.43 17.68,13.89 17.22,13.56L18.93,11.25M12.5,7.63C12.97,7.75 13.44,7.87 13.91,8L12.5,10.25C12.5,10.25 12.45,9.45 12.32,8.83C12.21,8.3 12,7.75 12.5,7.63Z" />
                    </svg>
                  </>
                )}
              </button>

              <div className="form-footer">
                <p>Didn't receive the code? <button type="button" className="text-link" onClick={handleResendOtp}>Resend OTP</button></p>
                <button type="button" className="text-link" onClick={() => setStep("login")}>
                  ← Back to Login
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      <style jsx>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .dialog-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 450px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.4s ease;
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dialog-header {
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: white;
          padding: 25px 25px 20px;
          position: relative;
        }
        
        .dialog-header h2 {
          margin: 0 0 5px;
          font-size: 1.8rem;
          font-weight: 700;
        }
        
        .dialog-header p {
          margin: 0;
          opacity: 0.9;
        }
        
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
        
        .login-form {
          padding: 25px;
        }
        
        .error-message.submit-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .input-wrapper input {
          width: 100%;
          padding: 14px 45px 14px 45px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .input-wrapper input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .input-wrapper input.error {
          border-color: #ef4444;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .password-toggle {
          position: absolute;
          right: 15px;
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
        
        .error-text {
          display: block;
          color: #ef4444;
          font-size: 0.85rem;
          margin-top: 5px;
        }
        
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
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
        
        .form-footer {
          margin-top: 20px;
          text-align: center;
        }
        
        .text-link {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .otp-notice {
          text-align: center;
          margin-bottom: 25px;
        }
        
        .otp-notice p {
          margin: 10px 0;
        }
        
        .email-display {
          font-weight: 600;
          color: #4f46e5;
          background: #eef2ff;
          padding: 8px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        
        @media (max-width: 480px) {
          .dialog-overlay {
            padding: 10px;
          }
          
          .dialog-content {
            border-radius: 12px;
          }
          
          .dialog-header {
            padding: 20px 20px 15px;
          }
          
          .login-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}