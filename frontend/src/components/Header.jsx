  import { useState, useEffect } from "react";
  import LoginDialog from "./LoginDialog";
  import SignupDialog from "./SignupDialog";
  import { Link } from "react-router-dom";
  import { useNavigate } from "react-router-dom";

  export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [userData, setUserData] = useState(null);
    const Navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("userData");
      setIsLoggedIn(!!token);
      if (user) {
        setUserData(JSON.parse(user));
      }
    }, []);

const handleLoginSuccess = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userData", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", user.name);
  localStorage.setItem("userId", user._id); // 👈 ab consistent hoga

  setIsLoggedIn(true);
  setUserData(user);
  setShowLogin(false);
};

const handleLogout = () => {
  // ✅ Clear everything properly
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");

  setIsLoggedIn(false);
  setUserData(null);
  setShowProfileMenu(false);
  setShowMobileMenu(false);

   window.location.href = "/";
};


    const toggleProfileMenu = () => {
      setShowProfileMenu(!showProfileMenu);
    };

    const toggleMobileMenu = () => {
      setShowMobileMenu(!showMobileMenu);
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showMobileMenu && !event.target.closest(".mobile-nav")) {
          setShowMobileMenu(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showMobileMenu]);

    return (
      <>
        <header className="header">
          <div className="header-content">
            {/* Left side - Logo and Slogan */}
            <div className="logo-section">
              <div className="logo">HelpForYou</div>
              <div className="slogan">Your Trusted Support Partner</div>
            </div>

            {/* Desktop Navigation - Right side */}
            <nav className="desktop-nav">
              {!isLoggedIn ? (
                <div className="auth-buttons">
                  <a href="/" className="nav-link">
                    Home
                  </a>
                  <Link to="/check-complaint-status" className="complaint-status-link">
                    Complaint Status
                  </Link>
                  <a href="/policy-HelpForYou" className="nav-link">
                    Policy
                  </a>
                  <a href="/help-HelpForYou" className="nav-link">
                    Help
                  </a>
                  <button
                    className="nav-btn login-btn"
                    onClick={() => setShowLogin(true)}
                  >
                    Login
                  </button>
                  <button
                    className="nav-btn signup-btn"
                    onClick={() => setShowSignup(true)}
                  >
                    Signup
                  </button>
                </div>
              ) : (
                <div className="user-nav">
                  <a href="/" className="nav-link">
                    Home
                  </a>
                  <a href="/file-complaint" className="nav-link">
                    Raise Complaint
                  </a>
                  <a href="/your-complaints" className="nav-link">
                    Your Complaints
                  </a>
                  <a href="/check-complaint-status" className="nav-link">
                    Complaint Status
                  </a>
                  <a href="/policy-HelpForYou" className="nav-link">
                    Policy
                  </a>
                  <a href="/help-HelpForYou" className="nav-link">
                    Help
                  </a>

                  <div className="profile-container">
                    <button
                      className="profile-toggle"
                      onClick={toggleProfileMenu}
                    >
                      <div className="user-avatar">
                        {userData?.name
                          ? userData.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <span className="user-name">
                        {userData?.name || "User"}
                      </span>
                      <svg
                        className="dropdown-icon"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                      >
                        <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                      </svg>
                    </button>

                    {showProfileMenu && (
                      <div className="profile-menu">
                        <div className="profile-header">
                          <div className="profile-avatar">
                            {userData?.profilePic
                              ? <img src={userData.profilePic} alt="Profile" style={{ width: "90%", height: "90%", borderRadius: "60%" }} />
                              : "U"}
                          </div>
                          <div className="profile-info">
                            <div className="profile-name">
                              {userData?.name || "User"}
                            </div>
                            <div className="profile-email">
                              {userData?.email || ""}
                            </div>
                          </div>
                        </div>
                        <div className="profile-menu-items">
                          <a href="/profile" className="menu-item">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="currentColor"
                                d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                              />
                            </svg>
                            <span>Profile</span>
                          </a>
                          <a href="/your-complaints" className="menu-item">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="currentColor"
                                d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"
                              />
                            </svg>
                            <span>Your Complaints</span>
                          </a>
                          <div className="menu-divider"></div>
                          <button
                            className="menu-item logout-item"
                            onClick={handleLogout}
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="currentColor"
                                d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
                              />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </nav>

            {/* Mobile menu toggle - Right side */}
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Navigation Sidebar */}
          <div className={`mobile-nav ${showMobileMenu ? "active" : ""}`}>
            <div className="mobile-nav-header">
              <div className="mobile-logo-section">
                <div className="logo">HelpForYou</div>
                <div className="slogan">Your Trusted Support Partner</div>
              </div>
              <button className="close-menu" onClick={toggleMobileMenu}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                  />
                </svg>
              </button>
            </div>

            <div className="mobile-nav-content">
              {!isLoggedIn ? (
                <div className="mobile-auth-buttons">
                  <a
                    href="/"
                    className="mobile-nav-link"
                    onClick={toggleMobileMenu}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="currentColor"
                        d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
                      />
                    </svg>
                    <span>Home</span>
                  </a>
                  <Link
                    to="/check-complaint-status"
                    className="mobile-nav-link"
                    onClick={toggleMobileMenu}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="currentColor"
                        d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"
                      />
                    </svg>
                    <span>Complaint Status</span>
                  </Link>

                  <button
                    className="mobile-nav-btn login-btn"
                    onClick={() => {
                      setShowLogin(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="mobile-nav-btn signup-btn"
                    onClick={() => {
                      setShowSignup(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    Signup
                  </button>
                </div>
              ) : (
                <>
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {userData?.name ? (
                        <span>{userData.name.charAt(0).toUpperCase()}</span>
                      ) : (
                        <img
                          src="https://img.icons8.com/?size=100&id=23264&format=png&color=000000"
                          alt="User Avatar"
                          style={{ width: "77%", height: "77%", borderRadius: "40%" }}
                        />
                      )}
                    </div>
                    <div className="mobile-user-details">
                      <div className="mobile-user-name">
                        {userData?.name || "User"}
                      </div>
                      <div className="mobile-user-email">
                        {userData?.email || ""}
                      </div>
                    </div>
                  </div>

                  <nav className="mobile-nav-menu">
                    <a
                      href="/"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
                        />
                      </svg>
                      <span>Home</span>
                    </a>
                    <a
                      href="/profile"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                        />
                      </svg>
                      <span>Profile</span>
                    </a>

                    <a
                      href="/file-complaint"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"
                        />
                      </svg>
                      <span>Raise Complaint</span>
                    </a>

                    <a
                      href="/your-complaints"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"
                        />
                      </svg>
                      <span>Your Complaints</span>
                    </a>

                    <a
                      href="/check-complaint-status"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z"
                        />
                      </svg>
                      <span>Complaint Status</span>
                    </a>

                    <a
                      href="/policy-HelpForYou"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,11H15V13H12V16H10V13H7V11H10V8H12V11Z"
                        />
                      </svg>
                      <span>Policy</span>
                    </a>

                    <a
                      href="/help-HelpForYou"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                        />
                      </svg>
                      <span>Help</span>
                    </a>

                    <div className="menu-divider"></div>

                    <button
                      className="mobile-nav-link logout-btn"
                      onClick={handleLogout}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="currentColor"
                          d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </nav>
                </>
              )}
            </div>
          </div>

          {/* Overlay for mobile menu */}
          {showMobileMenu && (
            <div className="mobile-nav-overlay" onClick={toggleMobileMenu}></div>
          )}
        </header>

        {/* Login Modal */}
        {showLogin && (
          <div className="modal-overlay">
            <LoginDialog
              onClose={() => setShowLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        )}

        {/* Signup Modal */}
        {showSignup && (
          <div className="modal-overlay">
            <SignupDialog
              onClose={() => setShowSignup(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        )}

        <style>{`
          /* Header styling */
          .header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: linear-gradient(90deg, #4f46e5, #3b82f6);
            color: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 3px 15px;
            }
          
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1px 15px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          /* Logo section - Left side */
          .logo-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-right: 180px;
          }
          
          .logo {
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: 1px;
          }
          
          .slogan {
            font-size: 0.75rem;
            opacity: 0.9;
            margin-top: 2px;
          }
          
          /* Desktop Navigation - Right side */
          .desktop-nav {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          
          @media (max-width: 768px) {
            .desktop-nav {
              display: none;
            }
          }
          
          .auth-buttons {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .complaint-status-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 12px;
            border-radius: 6px;
            transition: background-color 0.3s;
          }
          
          .complaint-status-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .user-nav {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 12px;
            border-radius: 6px;
            transition: background-color 0.3s;
            font-size: 0.9rem;
          }
          
          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .nav-btn {
            padding: 8px 20px;
            font-size: 0.9rem;
            font-weight: 500;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .login-btn {
            background: white;
            color: #4f46e5;
          }
          
          .login-btn:hover {
            background: #e0e7ff;
            transform: translateY(-2px);
          }
          
          .signup-btn {
            background: #facc15;
            color: #1e293b;
          }
          
          .signup-btn:hover {
            background: #fcd34d;
            transform: translateY(-2px);
          }
          
          /* Profile container */
          .profile-container {
            position: relative;
          }
          
          .profile-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.15);
            border: none;
            border-radius: 30px;
            padding: 8px 16px;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .profile-toggle:hover {
            background: rgba(255, 255, 255, 0.25);
          }
          
          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }
          
          .user-name {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .dropdown-icon {
            transition: transform 0.3s ease;
          }
          
          .profile-toggle:hover .dropdown-icon {
            transform: rotate(180deg);
          }
          
          /* Profile menu */
          .profile-menu {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 10px;
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            z-index: 1000;
            animation: slideDown 0.3s ease;
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .profile-header {
            display: flex;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
            color: white;
          }
          
          .profile-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: 600;
            margin-right: 15px;
          }
          
          .profile-info {
            flex: 1;
          }
          
          .profile-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 4px;
          }
          
          .profile-email {
            font-size: 0.85rem;
            opacity: 0.9;
          }
          
          .profile-menu-items {
            padding: 10px 0;
          }
          
          .menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 20px;
            background: none;
            border: none;
            text-align: left;
            color: #4b5563;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
          }
          
          .menu-item:hover {
            background: #f3f4f6;
            color: #4f46e5;
          }
          
          .menu-divider {
            height: 1px;
            background: #e5e7eb;
            margin: 8px 0;
          }
          
          .logout-item {
            color: #ef4444;
          }
          
          .logout-item:hover {
            background: #fef2f2;
            color: #dc2626;
          }
          
          /* Mobile menu toggle - Right side */
          .mobile-menu-toggle {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            height: 21px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
          }
          
          .mobile-menu-toggle span {
            height: 3px;
            width: 100%;
            background-color: white;
            border-radius: 3px;
            transition: all 0.3s ease;
          }
          
          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: flex;
            }
            
            .header-content {
              padding: 10px 15px;
            }
            
            .logo {
              font-size: 1.5rem;
            }
            
            .slogan {
              font-size: 0.7rem;
            }
          }
          
          /* Mobile navigation */
          .mobile-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 85%;
            max-width: 320px;
            height: 100vh;
            background: white;
            z-index: 1001;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
          }
          
          .mobile-nav.active {
            right: 0;
          }
          
          .mobile-nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
          }
          
          .mobile-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: linear-gradient(90deg, #4f46e5, #3b82f6);
            color: white;
          }
          
          .mobile-logo-section {
            display: flex;
            flex-direction: column;
          }
          
          .close-menu {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
          }
          
          .mobile-nav-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }
          
          .mobile-auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
          }
          
          .mobile-nav-btn {
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .mobile-user-info {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 20px;
          }
          
          .mobile-user-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: 600;
            color: white;
          }
          
          .mobile-user-details {
            flex: 1;
          }
          
          .mobile-user-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 4px;
            color: #1f2937;
          }
          
          .mobile-user-email {
            font-size: 0.85rem;
            color: #6b7280;
          }
          
          .mobile-nav-menu {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          
          .mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            color: #4b5563;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.2s ease;
          }
          
          .mobile-nav-link:hover {
            background: #f3f4f6;
            color: #4f46e5;
          }
          
          .logout-btn {
            color: #ef4444;
            background: none;
            border: none;
            text-align: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            width: 100%;
            border-radius: 6px;
            transition: all 0.2s ease;
          }
          
          .logout-btn:hover {
            background: #fef2f2;
          }
          
          /* Modal overlay */
          .modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
          }
          
          /* Modal fade-in animation */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </>
    );
  }