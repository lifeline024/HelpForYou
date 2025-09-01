import mongoose from "mongoose";

const PoliceComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  district: { type: String, required: true }, 
  location: { type: String, required: true }, 
  complaint: { type: String, required: true },
  proofFiles: [{ type: String }],
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
  reason: { type: String }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complaintId: { type: String, unique: true }, 
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate ComplaintId
PoliceComplaintSchema.pre("save", function (next) {
  if (!this.complaintId) {
    this.complaintId =
      "BRPLC-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model("PoliceComplaint", PoliceComplaintSchema);