import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PasswordReset from "./pages/PasswordReset";
import ResetPass from "./pages/ResetPass"; 
import "./App.css";
import "./pages/policy"
import Help from "./pages/Help";
import Policy from "./pages/policy";
import ComplaintForm from "./pages/ComplaintForm";
import UserDashboard from "./pages/UserDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import ComplaintStatusChecker from "./pages/ComplaintStatusChecker";
import ProfilePage from "./components/ProfileUser";
import FileComplaint from "./pages/FileComplaint";
import ComplaintHistory from "./components/ComplaintHistory";
import CyberComplaint from "./pages/CyberComplaint";
import MyCyberComplaints from "./pages/MyCyberComplaint";
import PoliceComplaintHistory from "./pages/PoliceComplaintHistory";
import StatusUpdatePage from "./components/StatusUpdate";
function App() {
  return (
    <Router>
      
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password-request" element={<PasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPass />} />
          <Route path="/policy-HelpForYou" element={<Policy />} />
          <Route path="/help-HelpForYou" element={<Help />} />
          <Route path="/departments/police" element={<ComplaintForm />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/department-dashboard" element={<DepartmentDashboard />} />
          <Route path="/check-complaint-status" element={<ComplaintStatusChecker />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/file-complaint" element={<FileComplaint />} />
          <Route path="/your-complaints" element={<ComplaintHistory />} />
          <Route path="/departments/cybercrime" element={<CyberComplaint />} />
          <Route path="/your-cyber-complaints" element={<MyCyberComplaints />} />
          <Route path="/PoliceComplaintHistory" element={<PoliceComplaintHistory />} />
          <Route path="/update-status" element={<StatusUpdatePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;