import React from "react";

export default function Modal({ onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Login/Signup Form */}
        <h2 className="text-2xl font-semibold text-center mb-4">Login / Signup</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
}
