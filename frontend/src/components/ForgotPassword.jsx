




import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import OTPVerification from './OTPVerification';

const ForgotPassword = ({ onBackToLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  // ✅ DEBUG: Track state changes
  useEffect(() => {
    console.log('🔄 ForgotPassword State Updated:', { 
      showOTP, 
      resetToken: resetToken ? '✅ Token Received' : '❌ No Token',
      showResetForm,
      email 
    });
  }, [showOTP, resetToken, showResetForm, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.forgotPassword(email);
      setMessage(result.message || 'OTP sent to your email');
      setShowOTP(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Proper token extraction
  const handleVerificationSuccess = (result) => {
    console.log('✅ handleVerificationSuccess called with:', result);

    // Extract token from the correct property
    const token = result?.resetToken;

    if (token) {
      console.log('🎯 Reset Token received:', token);
      setResetToken(token);
      setShowOTP(false);
      setShowResetForm(true);
      setError('');
      setMessage('');
    } else {
      console.error('❌ No reset token found in result:', result);
      setError('OTP verification succeeded but no reset token was returned.');
    }
  };

  const handleBackFromOTP = () => {
    setShowOTP(false);
    setError('');
    setMessage('');
  };

  console.log('🎯 RENDER STATE - showOTP:', showOTP, 'resetToken:', !!resetToken, 'showResetForm:', showResetForm);

  if (showOTP) {
    console.log('🔄 RENDERING: OTPVerification');
    return (
      <OTPVerification
        email={email}
        type="reset"
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackFromOTP}
      />
    );
  }

  // ✅ FIXED: Check both showResetForm AND resetToken
  if (showResetForm && resetToken) {
    console.log('🎯 SUCCESS: Rendering ResetPasswordForm!');
    return (
      <ResetPasswordForm 
        resetToken={resetToken}
        email={email}
        onBack={() => {
          console.log('↩️ Going back to OTP from ResetPassword');
          setResetToken('');
          setShowResetForm(false);
          setShowOTP(true);
        }}
        onSuccess={
          onBackToLogin
        }
      />
    );
  }

  console.log('📝 RENDERING: ForgotPassword Form');
  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <button
            onClick={onBackToLogin}
            className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-white/70">Enter your email to receive a verification code</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email address"
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
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending OTP...
              </>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/20">
          <span className="text-white/70">Remember your password? </span>
          <button
            onClick={onBackToLogin}
            className="text-purple-300 hover:text-purple-200 font-semibold"
          >
            Back to Login
          </button>
        </div>

        <div className="text-center mt-4">
          <span className="text-white/70">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-purple-300 hover:text-purple-200 font-semibold"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ FIXED: Reset Password Form Component with proper redirect timing
const ResetPasswordForm = ({ resetToken, email, onBack, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);



  useEffect(() => {
  if (success && message) {
    const timer = setTimeout(() => {
      console.log('✅ Auto-redirecting to login after success');
      onSuccess(); // ✅ Function now actually runs
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [success, message, onSuccess]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setSuccess(false);

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Sending reset request with token...');
      const result = await authAPI.resetPassword(resetToken, newPassword);
      console.log('✅ Reset password result:', result);
      
      if (result) {
        setMessage(result.message || 'Password reset successfully! Redirecting to login...');
         console.log('🔑 SUCCESS: ResetPasswordForm FINALLY RENDERED!');
        setSuccess(true);
        
        // Clear form on success
        setNewPassword('');
        setConfirmPassword('');
        
        // ✅ FIXED: Removed immediate onSuccess() call - now handled by useEffect
        
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('❌ Reset password error:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
            disabled={loading || success}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Set New Password</h2>
          <p className="text-white/70">
            For: <span className="text-purple-300 font-semibold">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {message}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter new password (min. 6 characters)"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <button
              onClick={onBack}
              className="text-purple-300 hover:text-purple-200 font-semibold"
              disabled={loading}
            >
              Back to OTP Verification
            </button>
          </div>
        )}

        {success && (
          <div className="text-center mt-6">
            <button
              onClick={onSuccess}
              className="text-purple-300 hover:text-purple-200 font-semibold underline"
            >
              Click here if not redirected automatically
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
