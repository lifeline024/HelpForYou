import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Camera, Save, Lock, User, Mail, Phone, MapPin, Shield, X, Loader } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    role: "",
    profilePic: "",
  });
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("https://helpforyou-backend.onrender.com/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
      setName(data.name);
      
      if (data.profilePic) {
        if (data.profilePic.startsWith('http')) {
          setPreviewUrl(data.profilePic);
        } else {
          setPreviewUrl(`https://helpforyou-backend.onrender.com/uploads/${data.profilePic}`);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch profile.");
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setMessage("File size too large. Please choose a file smaller than 1MB.");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage("Please select an image file (JPEG, PNG, etc.).");
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: '%',
      width: 90,
      aspect: 1 / 1,
    });
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  };

  const makeClientCrop = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        crop,
        'profile-pic.jpg'
      );
      
      // Check if cropped image is still under 1MB
      if (croppedImageBlob.size > 1024 * 1024) {
        setMessage("Cropped image is still too large. Please try a different image.");
        setShowCropModal(false);
        return;
      }
      
      setProfilePic(croppedImageBlob);
      setPreviewUrl(URL.createObjectURL(croppedImageBlob));
      setImageError(false);
    }
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCropChange = (crop) => {
    setCrop(crop);
  };

  const handleSaveCroppedImage = async () => {
    if (completedCrop) {
      await makeClientCrop(completedCrop);
    }
    setShowCropModal(false);
  };

  const validatePassword = () => {
    if (!password) return true;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 6;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password && !validatePassword()) {
      setMessage("Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (password) formData.append("password", password);
      if (profilePic) formData.append("profilePic", profilePic);

      const { data } = await axios.put(
        "https://helpforyou-backend.onrender.com/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(data.profile);
      setMessage("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setProfilePic(null);
      
      if (data.profile.profilePic) {
        if (data.profile.profilePic.startsWith('http')) {
          setPreviewUrl(data.profile.profilePic);
        } else {
          setPreviewUrl(`https://helpforyou-backend.onrender.com/uploads/${data.profile.profilePic}`);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Profile update failed. Please try again.");
    }
    setLoading(false);
  };

  const hasChanges = () => {
    return name !== profile.name || password || profilePic;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-blue-100 mt-2">Manage your account information and preferences</p>
          </div>

          <div className="p-6 md:p-8">
            {message && (
              <div className={`p-4 rounded-lg mb-6 text-center ${
                message.includes("success") 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {previewUrl && !imageError ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                
                <label 
                  htmlFor="profilePicInput" 
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
                >
                  <Camera size={20} />
                </label>
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Click the camera icon to upload a new profile picture (max 1MB)
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {password && (
                    <p className="text-xs text-gray-500 mt-2">
                      Must include uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>
              </div>

              {password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {hasChanges() && (
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} className="mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              )}
            </form>

            {/* User Information */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield size={24} className="mr-2 text-blue-600" />
                Account Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Mail size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Email Address</span>
                  </div>
                  <p className="text-gray-800">{profile.email || "Not provided"}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Phone size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Mobile Number</span>
                  </div>
                  <p className="text-gray-800">{profile.mobile || "Not provided"}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPin size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Address</span>
                  </div>
                  <p className="text-gray-800">{profile.address || "Not provided"}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Role</span>
                  </div>
                  <p className="text-gray-800 capitalize">{profile.role || "User"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && imgSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Crop Your Profile Picture</h3>
              <button 
                onClick={() => setShowCropModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
              aspect={1}
              className="max-h-96 mx-auto"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-h-96"
              />
            </ReactCrop>
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCroppedImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
