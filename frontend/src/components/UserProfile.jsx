// components/UserProfile.js
import React from 'react';

const UserProfile = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 className="text-xl font-bold text-white">{user.username}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-sm text-gray-400">Journals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">127</div>
              <div className="text-sm text-gray-400">Pages</div>
            </div>
          </div>

          {/* Member Since */}
          <div className="text-center text-gray-400 text-sm">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;