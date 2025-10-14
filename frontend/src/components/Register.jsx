
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import OTPVerification from './OTPVerification';



const Register = ({ onSwitchToLogin }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const { register } = useAuth();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await register(userData);
      
      if (result.success && result.requiresOTP) {
        setRegisteredEmail(userData.email);
        setShowOTP(true);
      } else if (result.success) {
        // Direct success (shouldn't happen with OTP)
      console.log("Successfull login")
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleVerificationSuccess = (result) => {
    // This will be called after successful OTP verification
    console.log('Verification successful:', result);
    // The OTPVerification component will handle navigation
  };

  const handleBackFromOTP = () => {
    setShowOTP(false);
    setError('');
    setUserData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={registeredEmail}
        username={userData.username}
        type="register"
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackFromOTP}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h2>
          <p className="text-white/70">Start your digital NoteBook</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Create a password (min. 6 characters)"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/20">
          <span className="text-white/70">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            disabled={loading}
            className="text-purple-300 hover:text-purple-200 font-semibold disabled:opacity-50"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
