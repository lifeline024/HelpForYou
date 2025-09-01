// backend/routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import cloudinary from "../utlis/cloudinary.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "./../utlis/sendEmail.js";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ====================== SIGNUP ======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, address, role, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      name,
      email,
      mobile,
      address,
      role: role || "User",
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ====================== LOGIN WITH OTP ======================
let otpStore = {}; // Temporary storage

// Step 1: login with email + password → send OTP
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit
    otpStore[email] = otp;

    // send email with OTP
    const otpHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #0f5132 0%, #0a3622 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .logo {
            color: white;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.8);
            margin: 5px 0 0;
            font-size: 14px;
          }
          .content {
            padding: 40px 30px;
          }
          .otp-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #0f5132;
          }
          .otp-code {
            font-size: 42px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #0f5132;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
          }
          .button {
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #0f5132 0%, #0a3622 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(15, 81, 50, 0.3);
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
            color: #6c757d;
          }
          .social-links {
            margin: 15px 0;
          }
          .social-links a {
            margin: 0 10px;
            text-decoration: none;
            color: #0f5132;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">HelpForYou</h1>
            <p class="tagline">Your Trusted Support Partner</p>
          </div>
          
          <div class="content">
            <h2 style="color: #0f5132; margin-top: 0;">Your One-Time Password</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to sign in to your HelpForYou account. Use the following OTP to complete your login:</p>
            
            <div class="otp-container">
              <p style="margin: 0; color: #6c757d;">Your verification code:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #dc3545; font-size: 14px;">This code will expire in 10 minutes</p>
            </div>
            
            <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
            
            <a href="https://helpforyou-frontend.onrender.com" class="button">Go to HelpForYou</a>
          </div>
          
          <div class="footer">
            <p>Need help? Contact our support team at support@helpforyou.com</p>
            <div class="social-links">
              <a href="#">Facebook</a> • <a href="#">Twitter</a> • <a href="#">Instagram</a>
            </div>
            <p>© ${new Date().getFullYear()} HelpForYou. All rights reserved.</p>
            <p>Design and Developed By Aayush Shivastava</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, "Your OTP Code - HelpForYou", `Your OTP is ${otp}`, otpHtml);

    res.json({ message: "OTP sent to your email. Please verify to complete login." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ... (previous imports and code) ...

// Step 2: verify OTP → issue token + send enhanced login notification
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otpStore[email] || otpStore[email] != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email]; // clear OTP

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Get device and location information from request
    const userAgent = req.get('User-Agent') || 'Unknown device';
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Extract browser and OS info from user agent
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    let deviceType = 'Unknown Device';
    
    // Simple parsing for browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    // Simple parsing for OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    // Simple parsing for device type
    if (userAgent.includes('Mobile')) deviceType = 'Mobile';
    else if (userAgent.includes('Tablet')) deviceType = 'Tablet';
    else deviceType = 'Desktop';
    
    // For location, we would typically use a geolocation API in production
    const location = "Unknown Location"; // In production, use an API like ipapi.co

    const loginTime = new Date().toLocaleString();
    
    // ====================== SEND ENHANCED LOGIN ALERT EMAIL ======================
    const loginAlertHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Alert - HelpForYou</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7f9;
            margin: 0;
            padding: 20px 0;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #0f5132 0%, #0a3622 100%);
            padding: 35px 20px;
            text-align: center;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background: #0f5132;
            border-radius: 50%;
          }
          .header::before {
            content: '🔒';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            z-index: 2;
            color: white;
          }
          .logo {
            color: white;
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 8px 0;
            letter-spacing: 0.5px;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.85);
            margin: 0;
            font-size: 16px;
          }
          .alert-icon {
            width: 90px;
            height: 90px;
            background: #fff3cd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 40px auto 25px;
            border: 4px solid #ffc107;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .alert-icon img {
            width: 45px;
            height: 45px;
          }
          .content {
            padding: 40px 35px;
            text-align: center;
          }
          h2 {
            color: #0f5132;
            margin: 0 0 20px 0;
            font-size: 26px;
          }
          p {
            margin-bottom: 18px;
            font-size: 16px;
            color: #444;
          }
          .login-details {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: left;
            border: 1px solid #e9ecef;
          }
          .detail-row {
            display: flex;
            margin-bottom: 14px;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .detail-label {
            font-weight: 600;
            color: #0f5132;
            min-width: 140px;
            font-size: 15px;
          }
          .detail-value {
            color: #495057;
            font-size: 15px;
          }
          .button {
            display: inline-block;
            padding: 16px 38px;
            background: linear-gradient(135deg, #0f5132 0%, #0a3622 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            margin: 25px 0 15px;
            box-shadow: 0 4px 15px rgba(15, 81, 50, 0.3);
            transition: all 0.3s ease;
            font-size: 16px;
            border: none;
            cursor: pointer;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(15, 81, 50, 0.4);
          }
          .security-section {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
            border-radius: 6px;
          }
          .security-title {
            font-weight: 700;
            color: #155724;
            margin-bottom: 10px;
            font-size: 17px;
            display: flex;
            align-items: center;
          }
          .security-title svg {
            margin-right: 10px;
          }
          .security-tips {
            padding-left: 20px;
          }
          .security-tips li {
            margin-bottom: 8px;
            color: #0f5132;
          }
          .footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
          }
          .footer-links {
            margin: 15px 0;
          }
          .footer-links a {
            margin: 0 12px;
            text-decoration: none;
            color: #0f5132;
            font-weight: 500;
            transition: color 0.2s;
          }
          .footer-links a:hover {
            color: #0a3622;
            text-decoration: underline;
          }
          .warning {
            color: #dc3545;
            font-weight: 600;
            margin-top: 20px;
            padding: 12px;
            background: #f8d7da;
            border-radius: 6px;
            border-left: 4px solid #dc3545;
          }
          @media (max-width: 650px) {
            .container {
              border-radius: 0;
              box-shadow: none;
            }
            .content {
              padding: 30px 20px;
            }
            .detail-row {
              flex-direction: column;
            }
            .detail-label {
              min-width: auto;
              margin-bottom: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">HelpForYou</h1>
            <p class="tagline">Your Trusted Support Partner</p>
          </div>
          
          <div class="content">
            <div class="alert-icon">
              <img src="https://img.icons8.com/color/96/security-checked.png" alt="Security Shield" />
            </div>
            
            <h2>New Login Detected</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>We noticed a recent login to your HelpForYou account. Here are the details:</p>
            
            <div class="login-details">
              <div class="detail-row">
                <span class="detail-label">Login Time:</span>
                <span class="detail-value">${loginTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account Email:</span>
                <span class="detail-value">${user.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Device Type:</span>
                <span class="detail-value">${deviceType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Browser:</span>
                <span class="detail-value">${browser} on ${os}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Approximate Location:</span>
                <span class="detail-value">${location}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">IP Address:</span>
                <span class="detail-value">${ipAddress}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #28a745; font-weight: 600;">Successful</span>
              </div>
            </div>
            
            <div class="security-section">
              <div class="security-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#155724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="#155724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Security Recommendations
              </div>
              <ul class="security-tips">
                <li>If you recognize this activity, no action is needed</li>
                <li>If you don't recognize this login, change your password immediately</li>
                <li>Enable two-factor authentication for added security</li>
                <li>Avoid using public computers for sensitive activities</li>
              </ul>
            </div>
            
            <p class="warning">If this wasn't you, please secure your account immediately by resetting your password.</p>
            
            <a href="https://helpforyou-frontend.onrender.com/change-password" class="button">Secure My Account</a>
          </div>
          
          <div class="footer">
            <p>This is an automated security alert from HelpForYou. Please do not reply to this email.</p>
            <div class="footer-links">
              <a href="https://helpforyou-frontend.onrender.com/help">Help Center</a>
              <a href="https://helpforyou-frontend.onrender.com/privacy">Privacy Policy</a>
              <a href="https://helpforyou-frontend.onrender.com/contact">Contact Support</a>
            </div>
            <p>© ${new Date().getFullYear()} HelpForYou. All rights reserved.</p>
            <p>Design and Developed By Aayush Shivastava</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      user.email, 
      "Login Alert - HelpForYou", 
      `Hello ${user.name},\n\nWe noticed a recent login to your HelpForYou account on ${loginTime}.\n\nDevice: ${deviceType}\nBrowser: ${browser} on ${os}\nLocation: ${location}\nIP Address: ${ipAddress}\n\nIf this was you, you can ignore this alert. If not, please reset your password immediately.`, 
      loginAlertHtml
    );

    res.json({
      message: "OTP verified, login successful",
      token,
      role: user.role,
      _id: user._id,   
      name: user.name,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ---------------------------------------------
// Forgot Password → send reset link via email
// ---------------------------------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `https://helpforyou-frontend.onrender.com/reset-password/${resetToken}`;

    const resetPasswordHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - HelpForYou</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #0f5132 0%, #0a3622 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            color: white;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .reset-button {
            display: inline-block;
            padding: 16px 35px;
            background: linear-gradient(135deg, #0f5132 0%, #0a3622 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(15, 81, 50, 0.3);
            font-size: 16px;
          }
          .link-text {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #6c757d;
          }
          .timer {
            background: #fff3cd;
            color: #856404;
            padding: 12px;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">HelpForYou</h1>
            <p style="color: rgba(255, 255, 255, 0.8); margin: 5px 0 0;">Password Reset</p>
          </div>
          
          <div class="content">
            <h2 style="color: #0f5132; margin-top: 0;">Reset Your Password</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>We received a request to reset your password for your HelpForYou account. Click the button below to proceed:</p>
            
            <div class="timer">
              ⏰ This link will expire in 15 minutes
            </div>
            
            <a href="${resetLink}" class="reset-button">Reset Password</a>
            
            <p>Or copy and paste this URL into your browser:</p>
            <div class="link-text">${resetLink}</div>
            
            <p style="color: #dc3545; font-weight: 600;">If you didn't request this password reset, please ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from HelpForYou. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} HelpForYou. All rights reserved.</p>
            <p>Design and Developed By Aayush Shivastava</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(user.email, "Reset Your Password - HelpForYou", resetPasswordHtml);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------------------------
// Reset Password → verify token & update password
// ---------------------------------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// GET /api/users/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      role: user.role,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put("/profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, password } = req.body;

    if (name) user.name = name;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        async (error, result) => {
          if (error) return res.status(500).json({ message: error.message });
          user.profilePic = result.secure_url;
          await user.save();
          res.json({
            message: "Profile updated successfully",
            profile: {
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              address: user.address,
              role: user.role,
              profilePic: user.profilePic,
            },
          });
        }
      );
      result.end(req.file.buffer); // send the buffer to cloudinary
      return; // exit early because response is sent inside callback
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      profile: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
