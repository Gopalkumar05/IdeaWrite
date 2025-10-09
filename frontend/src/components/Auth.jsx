// components/Auth.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

const Auth = () => {
  const [currentView, setCurrentView] = useState('login');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot')}
          />
        );
      case 'register':
        return (
          <Register 
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgot':
        return (
          <ForgotPassword
            onBackToLogin={() => setCurrentView('login')}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        );
      default:
        return (
          <Login
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot')}
          />
        );
    }
  };

  return renderView();
};

export default Auth;