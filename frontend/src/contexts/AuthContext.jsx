
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await authAPI.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const result = await authAPI.register(userData);
      
      // Backend should return requiresOTP: true
      if (result.success && result.requiresOTP) {
        return {
          success: true,
          requiresOTP: true,
          message: result.message
        };
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };


const verifyOTP = async (email, otp) => {
  try {
    // Call the API directly
    const result = await authAPI.verifyOtp(email, otp);
    
    if (result.success && result.token) {
      // ONLY set token and authenticate after OTP verification
      localStorage.setItem('authToken', result.token);
      setUser(result.user);
      setIsAuthenticated(true);
      
      return {
        success: true,
        message: result.message,
        user: result.user
      };
    } else {
      return {
        success: false,
        message: result.message || 'OTP verification failed'
      };
    }
  } catch (error) {
    console.error('OTP Verification error:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify OTP'
    };
  }
};



  const login = async (credentials) => {
    try {
      const result = await authAPI.login(credentials);
      
      if (result.success && result.token) {
        localStorage.setItem('authToken', result.token);
        setUser(result.user);
        setIsAuthenticated(true);
      } else if (result.requiresVerification) {
        // Handle case where user tries to login without verification
        return {
          success: false,
          requiresVerification: true,
          message: result.message
        };
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    verifyOTP,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;