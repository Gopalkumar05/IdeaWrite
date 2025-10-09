// // components/OTPVerification.js
// import React, { useState, useRef, useEffect } from 'react';
// import { authAPI } from '../services/api';

// const OTPVerification = ({ 
//   email, 
//   username, 
//   type = 'register', 
//   onVerificationSuccess, 
//   onBack 
// }) => {
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [countdown, setCountdown] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   const inputRefs = useRef([]);

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [countdown]);

//   const focusNextInput = (index) => {
//     if (index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const focusPrevInput = (index) => {
//     if (index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       focusNextInput(index);
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       focusPrevInput(index);
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text');
//     const pastedNumbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
//     if (pastedNumbers.length === 6) {
//       const newOtp = [...otp];
//       pastedNumbers.forEach((num, index) => {
//         newOtp[index] = num;
//       });
//       setOtp(newOtp);
//       inputRefs.current[5].focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const otpString = otp.join('');
//     if (otpString.length !== 6) {
//       setError('Please enter the complete 6-digit OTP');
//       setLoading(false);
//       return;
//     }

//     try {
//       let result;
//       if (type === 'register') {
//         result = await authAPI.verifyOtp(email, otpString);
//       } else {
//         result = await authAPI.verifyResetOtp(email, otpString);
//       }

//       if (onVerificationSuccess) {
//         onVerificationSuccess(result);
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to verify OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       let result;
//       if (type === 'register') {
//         result = await authAPI.resendOtp(email);
//       } else {
//         result = await authAPI.forgotPassword(email);
//       }

//       setMessage(result.message);
//       setOtp(['', '', '', '', '', '']);
//       setCountdown(60);
//       setCanResend(false);
//       inputRefs.current[0].focus();
//     } catch (err) {
//       setError(err.message || 'Failed to resend OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
//       <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
//         <div className="text-center mb-8">
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
//             >
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Back
//             </button>
//           )}
          
//           <h2 className="text-3xl font-bold text-white mb-2">
//             Verify Your Email
//           </h2>
//           <p className="text-white/70">
//             Enter the 6-digit code sent to<br />
//             <span className="text-purple-300 font-semibold">{email}</span>
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4 flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-4 flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex justify-center space-x-2">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 maxLength="1"
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 onPaste={index === 0 ? handlePaste : undefined}
//                 className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//                 disabled={loading}
//               />
//             ))}
//           </div>

//           <button
//             type="submit"
//             disabled={loading || otp.join('').length !== 6}
//             className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Verifying...
//               </>
//             ) : (
//               'Verify OTP'
//             )}
//           </button>
//         </form>

//         <div className="text-center mt-6 pt-6 border-t border-white/20">
//           <p className="text-white/70 mb-4">
//             Didn't receive the code?{' '}
//             {canResend ? (
//               <button
//                 onClick={handleResendOTP}
//                 disabled={loading}
//                 className="text-purple-300 hover:text-purple-200 font-semibold disabled:opacity-50"
//               >
//                 Resend OTP
//               </button>
//             ) : (
//               <span className="text-white/50">
//                 Resend in {countdown}s
//               </span>
//             )}
//           </p>
          
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OTPVerification;


// components/OTPVerification.js - FIXED VERSION
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';


const OTPVerification = ({ 
  email, 
 
  type = 'register', 
  onVerificationSuccess, 
  onBack 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const { verifyOTP } = useAuth();
  

  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const focusNextInput = (index) => {
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const focusPrevInput = (index) => {
    if (index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      focusNextInput(index);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusPrevInput(index);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pastedNumbers.length === 6) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const otpString = otp.join('');
//     if (otpString.length !== 6) {
//       setError('Please enter the complete 6-digit OTP');
//       setLoading(false);
//       return;
//     }

//     try {
//       let result;
      
//       if (type === 'register') {
//         // Use AuthContext's verifyOTP function
//         result = await verifyOTP(email, otpString);
        
//         if (result.success) {
//           setMessage('Email verified successfully! Redirecting...');
          
//           // Redirect after successful verification
       
           
          
//           // Call success callback if provided
//           if (onVerificationSuccess) {
//             onVerificationSuccess(result);
//           }
//         } else {
//           setError(result.message || 'Verification failed');
//         }
//       } else {
//         // For password reset
//         result = await authAPI.verifyResetOtp(email, otpString);
        
//         if (result.success) {
//           setMessage('OTP verified successfully!');
//           if (onVerificationSuccess) {
//             onVerificationSuccess(result);
//           }
//         } else {
//           setError(result.message || 'Verification failed');
//         }
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to verify OTP');
//     } finally {
//       setLoading(false);
//     }
//   };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const otpString = otp.join('');
  if (otpString.length !== 6) {
    setError('Please enter the complete 6-digit OTP');
    setLoading(false);
    return;
  }

  try {
    let result;
    
    if (type === 'register') {
      result = await verifyOTP(email, otpString);
    } else {
      // For password reset
      result = await authAPI.verifyResetOtp(email, otpString);
      
      console.log('✅ OTPVerification - Reset OTP verification result:', result);
       onVerificationSuccess(result);
      if (result.success) {
        setMessage('OTP verified successfully! Redirecting to password reset...');
        onVerificationSuccess(result);
        // ✅ FIX: Immediate callback without any delay
        console.log('✅ OTPVerification - Immediately calling onVerificationSuccess');
        if (onVerificationSuccess) {
          onVerificationSuccess(result);
        }
      } else {
        setError(result.message || 'OTP verification failed');
      }
    }
  } catch (err) {
    console.error('❌ OTP verification error:', err);
    setError(err.message || 'Failed to verify OTP');
  } finally {
    setLoading(false);
  }
};
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let result;
      if (type === 'register') {
        result = await authAPI.resendOtp(email);
      } else {
        result = await authAPI.forgotPassword(email);
      }

      if (result.success) {
        setMessage(result.message || 'OTP sent successfully!');
        setOtp(['', '', '', '', '', '']);
        setCountdown(60);
        setCanResend(false);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-white/70">
            Enter the 6-digit code sent to<br />
            <span className="text-purple-300 font-semibold">{email}</span>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
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
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/20">
          <p className="text-white/70 mb-4">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="text-purple-300 hover:text-purple-200 font-semibold disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-white/50">
                Resend in {countdown}s
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;