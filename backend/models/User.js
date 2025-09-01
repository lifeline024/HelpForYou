import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
       type: String,
       default: ""
     },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;