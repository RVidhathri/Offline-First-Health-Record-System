import React, { useState, useCallback } from "react";
import { auth, testFirebaseConnection } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { styles } from "../style";
import { useTheme } from "../ThemeContext";
import {
  loginContainerStyle,
  inputStyle,
  buttonStyle,
  labelStyle,
  formPageWrapper,
} from "../style";



const Login = () => {
  const { darkMode } = useTheme();
  const currentStyles = styles(darkMode);

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [verificationId, setVerificationId] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const navigate = useNavigate();

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Initialize reCAPTCHA verifier
  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        console.log("reCAPTCHA verified");
      },
      'expired-callback': () => {
        toast.error("reCAPTCHA expired. Please try again.");
      }
    });
  };

  const validateForm = () => {
    if (loginMethod === 'email') {
      if (!email.trim()) {
        setError("Please enter your email");
        return false;
      }
      if (!password.trim()) {
        setError("Please enter your password");
        return false;
      }
    } else {
      if (!phoneNumber.trim()) {
        setError("Please enter your phone number");
        return false;
      }
      // Basic phone number validation
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Please enter a valid phone number with country code (e.g., +1234567890)");
        return false;
      }
    }
    return true;
  };

  const handlePhoneLogin = async () => {
    try {
      setupRecaptcha();

      const phoneProvider = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, phoneProvider);
      setVerificationId(confirmationResult.verificationId);
      setShowVerificationInput(true);
      toast.success("Verification code sent to your phone!");
    } catch (error) {
      console.error("Phone login error:", error);
      setError(mapFirebaseError(error.code));
      toast.error(error.message);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    }
  };

  const handleLogin = async (e, isRetry = false) => {
    e?.preventDefault();

    if (!isRetry && !validateForm()) {
      return;
    }

    if (!isRetry) {
      setLoading(true);
      setError("");
    }

    try {
      // Test Firebase connection before attempting login
      const isConnected = await testFirebaseConnection().catch(error => {
        console.error("Firebase connection test failed:", error);
        throw new Error("Unable to connect to authentication service. Please check your internet connection.");
      });

      if (!isConnected) {
        throw new Error("Authentication service is not available. Please try again later.");
      }

      if (loginMethod === 'email') {
        console.log("Attempting email login with:", email);
        
        if (!auth) {
          throw new Error("Authentication service is not initialized. Please refresh the page.");
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user) {
          throw new Error("No user data received after login");
        }

        console.log("Login successful:", userCredential.user.uid);
        

        toast.success("Login successful!");
        
        // Small delay to ensure Firebase auth state is updated
        await sleep(500);
        navigate("/profile");
      } else {
        // Phone login
        await handlePhoneLogin();
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle network errors with retry logic
      if (err.code === 'auth/network-request-failed' && retryCount < MAX_RETRIES) {
        console.log(`Retrying login attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setError(`Network error. Retrying... (Attempt ${retryCount + 1} of ${MAX_RETRIES})`);
        toast.info(`Retrying connection... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        
        // Wait before retrying
        await sleep(RETRY_DELAY);
        return handleLogin(null, true);
      }

      const errorMessage = mapFirebaseError(err.code);
      setError(errorMessage);
      toast.error(errorMessage);

      // Reset retry count if we're giving up or it's not a network error
      if (err.code !== 'auth/network-request-failed' || retryCount >= MAX_RETRIES) {
        setRetryCount(0);
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  };

  const mapFirebaseError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email format. Please enter a valid email.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many login attempts. Please try again later.";
      case "auth/network-request-failed":
        return retryCount >= MAX_RETRIES 
          ? "Network error. Please check your internet connection and try again." 
          : `Network error. Retrying... (Attempt ${retryCount} of ${MAX_RETRIES})`;
      case "auth/internal-error":
        return "An internal error occurred. Please try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/invalid-phone-number":
        return "The phone number is invalid. Please enter a valid phone number.";
      case "auth/invalid-verification-code":
        return "Invalid verification code. Please try again.";
      case "auth/code-expired":
        return "The verification code has expired. Please request a new one.";
      default:
        return `Login failed: ${code || 'Unknown error'}`;
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'email' ? 'phone' : 'email');
    setError("");
    setShowVerificationInput(false);
    setVerificationId("");
    setPhoneNumber("");
    setEmail("");
    setPassword("");
  };

  return (
    <div style={formPageWrapper(darkMode)}>
      <div style={loginContainerStyle(darkMode)}>
        <h2 style={{ color: darkMode ? '#fff' : '#333', marginBottom: '1.5rem' }}>Login</h2>
        
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <button
            onClick={toggleLoginMethod}
            style={{
              ...buttonStyle(darkMode),
              backgroundColor: 'transparent',
              border: `1px solid ${darkMode ? '#fff' : '#333'}`,
              padding: '0.5rem 1rem',
              marginBottom: '1rem'
            }}
          >
            Switch to {loginMethod === 'email' ? 'Phone' : 'Email'} Login
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle(darkMode)}>
              {loginMethod === 'email' ? 'Email' : 'Phone Number'}
            </label>
            {loginMethod === 'email' ? (
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle(darkMode)}
                required
                disabled={loading}
              />
            ) : (
              <input
                type="tel"
                value={phoneNumber}
                placeholder="Enter phone number with country code (+1234567890)"
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={inputStyle(darkMode)}
                required
                disabled={loading}
              />
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle(darkMode)}>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle(darkMode)}
              required
              disabled={loading}
            />
          </div>

          {loginMethod === 'phone' && (
            <div id="recaptcha-container" style={{ marginBottom: '1rem' }}></div>
          )}

          <button 
            type="submit" 
            style={{
              ...buttonStyle(darkMode),
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p style={{ 
              color: '#dc3545', 
              marginTop: '1rem', 
              padding: '0.5rem', 
              backgroundColor: darkMode ? 'rgba(220, 53, 69, 0.1)' : 'rgba(220, 53, 69, 0.05)',
              borderRadius: '4px'
            }}>
              {error}
            </p>
          )}
        </form>

        <div style={{ 
          marginTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <Link 
            to="/reset-password" 
            style={{ 
              color: darkMode ? '#66b3ff' : '#0077cc',
              textDecoration: 'none',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Forgot your password?
          </Link>
          <div style={{ color: darkMode ? '#aaa' : '#666' }}>
            Don't have an account?{" "}
            <Link 
              to="/register" 
              style={{ 
                color: darkMode ? '#66b3ff' : '#0077cc',
                textDecoration: 'none',
                ':hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
