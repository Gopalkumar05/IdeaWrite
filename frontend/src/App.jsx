

// // App.js - Main component
// import React, { useState } from 'react';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Login from './components/Login';
// import Register from './components/Register';
// import Book from './components/Book';

// const AuthWrapper = () => {
//   const { isAuthenticated, loading} = useAuth();
//   const [isLogin, setIsLogin] = useState(true);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
//         <div className="text-white text-xl flex items-center gap-3">
//           <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return isLogin ? (
//       <Login onSwitchToRegister={() => setIsLogin(false)} />
//     ) : (
//       <Register onSwitchToLogin={() => setIsLogin(true)} />
//     );
//   }

//   return <Book />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <AuthWrapper />
//     </AuthProvider>
//   );
// }

// export default App;



// App.js - Main component
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Book from './components/Book';

const AuthWrapper = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'forgot'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authView) {
      case 'login':
        return (
          <Login 
            onSwitchToRegister={() => setAuthView('register')}
            onSwitchToForgotPassword={() => setAuthView('forgot')}
          />
        );
      case 'register':
        return (
          <Register 
            onSwitchToLogin={() => setAuthView('login')}
          />
        );
      case 'forgot':
        return (
          <ForgotPassword 
            onBackToLogin={() => setAuthView('login')}
            onSwitchToRegister={() => setAuthView('register')}
          />
        );
      default:
        return (
          <Login 
            onSwitchToRegister={() => setAuthView('register')}
            onSwitchToForgotPassword={() => setAuthView('forgot')}
          />
        );
    }
  }

  return <Book />;
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;