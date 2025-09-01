import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../utlis/cloudinary.js";
import CyberComplaint from "../models/CyberComplaint.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import sendEmail from "../utlis/sendEmail.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary upload helper
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cyber_complaints" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Generate PDF function
const generateComplaintPDF = (complaint, status) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 40, right: 40 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

// Add official header with watermark
doc.rect(0, 0, doc.page.width, 100).fill('#0f5132');

// Add logo image
const logoPath = path.join(process.cwd(), 'routes', 'logo.png');
try {
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 25, { 
      width: 50, 
      height: 50,
      fit: [50, 50]
    });
  } else {
    // Fallback to text if image not found
    doc.circle(70, 50, 25)
      .lineWidth(2)
      .strokeOpacity(0.7)
      .stroke('#fff')
      .fill('#0a3622');
    
    doc.fontSize(12)
      .fillColor('white')
      .text('HFY', 63, 42, { align: 'center', width: 50 });
    
    doc.fontSize(7)
      .fillColor('white')
      .text('OFFICIAL', 63, 56, { align: 'center', width: 50 });
    
    console.log('Logo image not found at:', logoPath, 'Using text fallback');
  }
} catch (error) {
  console.error('Error loading logo:', error);
  // Fallback to text if image loading fails
  doc.circle(70, 50, 25)
    .lineWidth(2)
    .strokeOpacity(0.7)
    .stroke('#fff')
    .fill('#0a3622');
  
  doc.fontSize(12)
    .fillColor('white')
    .text('HFY', 63, 42, { align: 'center', width: 50 });
  
  doc.fontSize(7)
    .fillColor('white')
    .text('OFFICIAL', 63, 56, { align: 'center', width: 50 });
}

// Organization name - adjusted position to account for logo
doc.fontSize(20)
  .fillColor('white')
  .font('Helvetica-Bold')
  .text('HelpForYou', 110, 30);

doc.fontSize(10)
  .fillColor('white')
  .font('Helvetica')
  .text('our Trusted Support Partner', 110, 55);

doc.fontSize(8)
  .fillColor('white')
  .text('Registered Grievance Portal', 110, 70);
      // Document title with background
      doc.rect(40, 110, doc.page.width - 80, 25)
        .fill('#e8f5e9');
      
      doc.fontSize(16)
        .fillColor('#0f5132')
        .font('Helvetica-Bold')
        .text('OFFICIAL CYBER COMPLAINT DOCUMENT', 0, 115, {
          align: 'center',
          width: doc.page.width
        });

      // Reference number and dates section
      const boxY = 150;
      doc.rect(40, boxY, doc.page.width - 80, 70)
        .fill('#f8f9fa')
        .stroke('#dee2e6');
      
      doc.fontSize(10)
        .fillColor('#495057')
        .font('Helvetica-Bold')
        .text('REFERENCE NUMBER:', 50, boxY + 15);
      
      doc.fontSize(12)
        .fillColor('#0f5132')
        .text(complaint.complaintId, 50, boxY + 30);
      
      doc.fontSize(10)
        .fillColor('#495057')
        .font('Helvetica-Bold')
        .text('ISSUED DATE:', 250, boxY + 15);
      
      doc.fontSize(10)
        .fillColor('#6c757d')
        .font('Helvetica')
        .text(new Date(complaint.createdAt).toLocaleDateString(), 250, boxY + 30);
      
      doc.fontSize(10)
        .fillColor('#495057')
        .font('Helvetica-Bold')
        .text('LAST UPDATED:', 250, boxY + 45);
      
      doc.fontSize(10)
        .fillColor('#6c757d')
        .font('Helvetica')
        .text(new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString(), 250, boxY + 60);

      // Status badge
      const statusY = boxY + 85;
      const statusColors = {
        'Requested': { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb' },
        'Resolved': { bg: '#e8f5e9', text: '#2e7d32', border: '#c8e6c9' },
        'Rejected': { bg: '#ffebee', text: '#c62828', border: '#ffcdd2' },
        'Unsolved': { bg: '#fff3e0', text: '#ef6c00', border: '#ffe0b2' },
        'Received at department': { bg: '#f3e5f5', text: '#7b1fa2', border: '#e1bee7' },
        'Under Processing': { bg: '#fff8e1', text: '#ff8f00', border: '#ffecb3' }
      };
      
      const statusStyle = statusColors[status] || statusColors['Requested'];
      
      doc.roundedRect(40, statusY, doc.page.width - 80, 25, 3)
        .fill(statusStyle.bg)
        .stroke(statusStyle.border);
      
      doc.fontSize(12)
        .fillColor(statusStyle.text)
        .font('Helvetica-Bold')
        .text(`STATUS: ${status.toUpperCase()}`, 0, statusY + 6, {
          align: 'center',
          width: doc.page.width
        });

      // Complainant details section
      const detailsY = statusY + 40;
      doc.fontSize(12)
        .fillColor('#0f5132')
        .font('Helvetica-Bold')
        .text('COMPLAINANT INFORMATION', 40, detailsY);
      
      // Horizontal line
      doc.moveTo(40, detailsY + 20)
        .lineTo(doc.page.width - 40, detailsY + 20)
        .stroke('#dee2e6');
      
      const details = [
        { label: 'Full Name', value: complaint.name },
        { label: 'Email Address', value: complaint.email },
        { label: 'Mobile Number', value: complaint.phone },
        { label: 'Address', value: complaint.address || 'N/A' },
        { label: 'Complaint Type', value: complaint.complaintType }
      ];
      
      let currentY = detailsY + 30;
      details.forEach((item, index) => {
        doc.fontSize(10)
          .fillColor('#495057')
          .font('Helvetica-Bold')
          .text(`${item.label}:`, 50, currentY);
        
        doc.fontSize(10)
          .fillColor('#6c757d')
          .font('Helvetica')
          .text(item.value, 150, currentY);
        
        currentY += 20;
      });

      // Complaint description
      const descY = currentY + 10;
      doc.fontSize(12)
        .fillColor('#0f5132')
        .font('Helvetica-Bold')
        .text('COMPLAINT DESCRIPTION', 40, descY);
      
      doc.moveTo(40, descY + 20)
        .lineTo(doc.page.width - 40, descY + 20)
        .stroke('#dee2e6');
      
      doc.fontSize(10)
        .fillColor('#495057')
        .font('Helvetica')
        .text(complaint.description, 50, descY + 30, {
          width: doc.page.width - 100,
          align: 'justify',
          lineGap: 5
        });

      // Additional Cyber Complaint Details
      if (complaint.subject || complaint.transactionId || complaint.amountInvolved) {
        const cyberDetailsY = doc.y + 20;
        doc.fontSize(12)
          .fillColor('#0f5132')
          .font('Helvetica-Bold')
          .text('ADDITIONAL CYBER CRIME DETAILS', 40, cyberDetailsY);
        
        doc.moveTo(40, cyberDetailsY + 20)
          .lineTo(doc.page.width - 40, cyberDetailsY + 20)
          .stroke('#dee2e6');
        
        let cyberCurrentY = cyberDetailsY + 30;
        if (complaint.subject) {
          doc.fontSize(10)
            .fillColor('#495057')
            .font('Helvetica-Bold')
            .text('Subject:', 50, cyberCurrentY);
          doc.fontSize(10)
            .fillColor('#6c757d')
            .font('Helvetica')
            .text(complaint.subject, 150, cyberCurrentY);
          cyberCurrentY += 20;
        }
        if (complaint.transactionId) {
          doc.fontSize(10)
            .fillColor('#495057')
            .font('Helvetica-Bold')
            .text('Transaction ID:', 50, cyberCurrentY);
          doc.fontSize(10)
            .fillColor('#6c757d')
            .font('Helvetica')
            .text(complaint.transactionId, 150, cyberCurrentY);
          cyberCurrentY += 20;
        }
        if (complaint.amountInvolved) {
          doc.fontSize(10)
            .fillColor('#495057')
            .font('Helvetica-Bold')
            .text('Amount Involved:', 50, cyberCurrentY);
          doc.fontSize(10)
            .fillColor('#6c757d')
            .font('Helvetica')
            .text(`₹${complaint.amountInvolved.toFixed(2)}`, 150, cyberCurrentY);
          cyberCurrentY += 20;
        }
      }

      // Attached files section
if (complaint.evidenceFiles && complaint.evidenceFiles.length > 0) {
  const filesY = doc.y + 20;
  doc.fontSize(12)
    .fillColor('#0f5132')
    .font('Helvetica-Bold')
    .text('ATTACHED EVIDENCE FILES', 40, filesY);
  
  doc.moveTo(40, filesY + 20)
    .lineTo(doc.page.width - 40, filesY + 20)
    .stroke('#dee2e6');
  
  // Instructions for accessing files
  doc.fontSize(8)
    .fillColor('#6c757d')
    .font('Helvetica-Oblique')
    .text('Note: Click on the links below to view attached files in your web browser.', 50, doc.y + 15);
  
  complaint.evidenceFiles.forEach((file, index) => {
    const fileUrl = file;
    const linkText = `📎 Click to view File ${index + 1}`;
    
    // Calculate position for the link
    const linkY = doc.y + 10;
    
    // Add clickable link with blue color and underline
    doc.fontSize(9)
      .fillColor('#1a73e8') // Standard link blue
      .font('Helvetica')
      .text(linkText, 50, linkY, {
        link: fileUrl,
        underline: true
      });
    
    // Add file type indicator based on extension
    const fileExtension = file.split('.').pop().toLowerCase();
    let fileType = "File";
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
      fileType = "Image";
    } else if (['mp4', 'mov', 'avi', 'wmv'].includes(fileExtension)) {
      fileType = "Video";
    } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
      fileType = "Document";
    }
    
    doc.fontSize(7)
      .fillColor('#6c757d')
      .font('Helvetica')
      .text(`(${fileType})`, 50, doc.y + 2);
  });
  
  // Add a note about what to do if links don't work
  doc.fontSize(8)
    .fillColor('#6c757d')
    .font('Helvetica-Oblique')
    .text('If links are not working, copy and paste the URLs manually into your browser.', 50, doc.y + 15);
}

      // Important instructions section
      const instructionsY = doc.y + 30;
      doc.rect(40, instructionsY, doc.page.width - 80, 100)
        .fill('#fff3cd')
        .stroke('#ffeaa7');
      
      doc.fontSize(11)
        .fillColor('#856404')
        .font('Helvetica-Bold')
        .text('IMPORTANT INSTRUCTIONS', 0, instructionsY + 10, {
          align: 'center',
          width: doc.page.width
        });
      
      const instructions = [
        "• This is an official document. Keep it safe for future reference.",
        "• Check your complaint status regularly using your Complaint ID.",
        "• Department response time is typically 24-48 working hours.",
        "• For status inquiries, contact support@helpforyou.com with your Complaint ID.",
        "• Do not share this document with unauthorized persons."
      ];
      
      let instructionY = instructionsY + 25;
      instructions.forEach((instruction, index) => {
        doc.fontSize(9)
          .fillColor('#856404')
          .font('Helvetica')
          .text(instruction, 50, instructionY, {
            width: doc.page.width - 100,
            continued: false
          });
        instructionY += 15;
      });

      // Footer with official information
      const footerY = doc.page.height - 60;
      doc.moveTo(40, footerY)
        .lineTo(doc.page.width - 40, footerY)
        .stroke('#dee2e6');
      
      doc.fontSize(8)
        .fillColor('#6c757d')
        .font('Helvetica-Oblique')
        .text('This is an electronically generated official document. No signature required.', 40, footerY + 10, {
          width: doc.page.width - 80,
          align: 'center'
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Email template function
const getStatusEmailTemplate = (complaint, status, reason = "") => {
  const statusMessages = {
    "Requested": {
      subject: "Cyber Complaint Registered Successfully - HelpForYou",
      title: "Cyber Complaint Registered Successfully",
      message: `Your cyber complaint has been successfully registered with complaint ID: <strong>${complaint.complaintId}</strong>. We have attached a copy of your complaint details for your reference.`
    },
    "Resolved": {
      subject: "Cyber Complaint Resolved - HelpForYou",
      title: "Cyber Complaint Resolved",
      message: `Great news! Your cyber complaint (ID: <strong>${complaint.complaintId}</strong>) has been successfully resolved. Thank you for using our services.`
    },
    "Rejected": {
      subject: "Cyber Complaint Status Update - HelpForYou",
      title: "Cyber Complaint Rejected",
      message: `Your cyber complaint (ID: <strong>${complaint.complaintId}</strong>) has been reviewed and rejected.${reason ? ` Reason: ${reason}` : ''}`
    },
    "Unsolved": {
      subject: "Cyber Complaint Status Update - HelpForYou",
      title: "Cyber Complaint Marked as Unsolved",
      message: `Your cyber complaint (ID: <strong>${complaint.complaintId}</strong>) has been marked as unsolved due to unresolved circumstances.${reason ? ` Reason: ${reason}` : ''}`
    },
    "Received at department": {
      subject: "Cyber Complaint Received by Department - HelpForYou",
      title: "Cyber Complaint Received",
      message: `Your cyber complaint (ID: <strong>${complaint.complaintId}</strong>) has been received by the concerned department and is being processed.`
    },
    "Under Processing": {
      subject: "Cyber Complaint Under Processing - HelpForYou",
      title: "Under Processing",
      message: `Your cyber complaint (ID: <strong>${complaint.complaintId}</strong>) is currently being processed by our team. We'll update you soon.`
    }
  };

  const statusInfo = statusMessages[status] || statusMessages["Requested"];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.subject}</title>
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
        .status-badge {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .status-requested { background: #e3f2fd; color: #1565c0; }
        .status-received { background: #fff3e0; color: #ef6c00; }
        .status-processing { background: #e8f5e9; color: #2e7d32; }
        .status-resolved { background: #e8f5e9; color: #2e7d32; }
        .status-rejected { background: #ffebee; color: #c62828; }
        .status-unsolved { background: #f5f5f5; color: #616161; }
        .complaint-details {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
          text-align: left;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #0f5132;
          min-width: 120px;
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
          font-size: 12px;
          color: #6c757d;
        }
        .reason-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          border-radius: 4px;
        }
        .attachment-note {
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">HelpForYou</h1>
          <p style="color: rgba(255, 255, 255, 0.8); margin: 5px 0 0;">Cyber Complaint Status Update</p>
        </div>
        
        <div class="content">
          <div class="status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}">
            ${status}
          </div>
          
          <h2 style="color: #0f5132; margin-top: 0;">${statusInfo.title}</h2>
          <p>Hello <strong>${complaint.name}</strong>,</p>
          <p>${statusInfo.message}</p>
          
          ${reason ? `
            <div class="reason-box">
              <strong>Reason:</strong> ${reason}
            </div>
          ` : ''}
          
          <div class="attachment-note">
            <strong>📎 Attachment:</strong> We've attached a detailed PDF copy of your cyber complaint for your records.
            This document includes all your complaint details, timestamps, and is officially verified by HelpForYou.
          </div>
          
          <div class="complaint-details">
            <div class="detail-row">
              <span class="detail-label">Complaint ID:</span>
              <span>${complaint.complaintId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Complaint Type:</span>
              <span>${complaint.complaintType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted On:</span>
              <span>${new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
            ${status === "Resolved" ? `
              <div class="detail-row">
                <span class="detail-label">Resolved On:</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
            ` : ''}
          </div>
          
          <a href="https://helpforyou-frontend.onrender.com/check-cyber-complaint-status" class="button">
            Check Cyber Complaint Status
          </a>
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
};

// Create complaint
router.post("/create", authMiddleware, upload.array("evidenceFiles", 5), async (req, res) => {
  try {
    const { name, email, phone, address, complaintType, subject, description, transactionId, amountInvolved } = req.body;

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await streamUpload(file.buffer);
        uploadedFiles.push(result.secure_url);
      }
    }

    const newComplaint = new CyberComplaint({
      name,
      email,
      phone,
      address,
      complaintType,
      subject,
      description,
      transactionId,
      amountInvolved,
      evidenceFiles: uploadedFiles,
      userId: req.user.id,
    });

    await newComplaint.save();

    // Generate PDF
    const pdfBuffer = await generateComplaintPDF(newComplaint, "Requested");
    
    // Send email with PDF attachment
    const emailHtml = getStatusEmailTemplate(newComplaint, "Requested");
    await sendEmail(
      email,
      "Cyber Complaint Registered Successfully - HelpForYou",
      `Your cyber complaint has been registered successfully. Complaint ID: ${newComplaint.complaintId}`,
      emailHtml,
      [
        {
          filename: `CyberComplaint_${newComplaint.complaintId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    );

    res.status(201).json({ success: true, complaint: newComplaint });
  } catch (err) {
    console.error("Error creating cyber complaint:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update status & reason (department use)
router.put("/update-status/:complaintId", authMiddleware, async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, reason } = req.body;

    const validStatuses = [
      "Requested",
      "Received at department",
      "Under Processing",
      "Resolved",
      "Rejected",
      "Unsolved",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const complaint = await CyberComplaint.findOneAndUpdate(
      { complaintId },
      { status, reason, updatedAt: new Date() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Cyber complaint not found" });
    }

    // Generate updated PDF
    const pdfBuffer = await generateComplaintPDF(complaint, status);
    
    // Send email notification with PDF attachment
    const emailHtml = getStatusEmailTemplate(complaint, status, reason);
    await sendEmail(
      complaint.email,
      `Cyber Complaint Status Update - ${status} - HelpForYou`,
      `Your cyber complaint status has been updated to: ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      emailHtml,
      [
        {
          filename: `CyberComplaint_${complaint.complaintId}_${status}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    );

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get complaints of logged-in user
router.get("/my-complaints", authMiddleware, async (req, res) => {
  try {
    const complaints = await CyberComplaint.find({ userId: req.user.id });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search by complaintId (public route - no authentication required)
router.get("/search/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await CyberComplaint.findOne({ complaintId });
    if (!complaint)
      return res.status(404).json({ success: false, message: "Cyber complaint not found" });
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// Get all cyber complaints (for department dashboard)
router.get("/", async (req, res) => {
  try {
    const complaints = await CyberComplaint.find().sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;

