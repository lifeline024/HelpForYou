// models/cybercomplaint.js
import mongoose from "mongoose";

const CyberComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Complainant's Name
  email: { type: String, required: true }, // Complainant's Email
  phone: { type: String, required: true }, // Contact Number
  address: { type: String }, // Optional Address

  complaintType: { 
    type: String, 
    enum: [
      "Online Fraud",
      "Phishing",
      "Cyber Bullying",
      "Hacking",
      "Identity Theft",
      "UPI/Bank Fraud",
      "Social Media Crime",
      "Other"
    ], 
    required: true 
  }, // Type of cyber crime

  subject: { type: String, required: true }, // Short title/subject
  description: { type: String, required: true }, // Detailed description of complaint
  transactionId: { type: String }, // In case of fraud/UPI/bank-related
  amountInvolved: { type: Number }, // For financial fraud cases
  evidenceFiles: [{ type: String }], // Array of file paths (screenshots, docs, etc.)

  status: {
    type: String,
    enum: [
      "Requested",
      "Received at department",
      "Under Processing",
      "Resolved",
      "Rejected",
      "Unsolved"
    ],
    default: "Requested",
  },

  reason: { type: String }, // Reason for rejection/closure if needed

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  complaintId: { type: String, unique: true },

  createdAt: { type: Date, default: Date.now }
});

// Auto-generate ComplaintId before saving
CyberComplaintSchema.pre("save", function (next) {
  if (!this.complaintId) {
    this.complaintId =
      "BRCYB-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model("CyberComplaint", CyberComplaintSchema);
