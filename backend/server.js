import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import PoliceComplaintRoutes from "./routes/PoliceComplaintRoutes.js";
import CyberComplaint from "./routes/CyberComplaint.js";
dotenv.config();
connectDB();

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://helpforyou-frontend.onrender.com/",
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// ------------------- ROUTES -------------------
app.get("/", (req, res) => {
  res.send("HelpForYou API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/complaints", PoliceComplaintRoutes);
app.use("/api/cyber-complaints", CyberComplaint);

app.get('/', (req, res) => {
  res.json({ message: 'HelpForYou API is running!' });
});

// ------------------- ERROR HANDLING -------------------
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 5 files allowed.' });
    }
  }

  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
  });
});

// ------------------- SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
