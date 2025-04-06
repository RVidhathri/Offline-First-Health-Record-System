import React, { useState } from "react";
import { auth, db, testFirebaseConnection, initializeFirebase } from "../firebaseConfig";
import { createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  labelStyle,
  inputStyle,
  buttonStyle,
} from "../style";
import { PageContainer, ContentContainer, Card } from '../styles/SharedStyles';



const Register = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [registrationMethod, setRegistrationMethod] = useState('email');
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    location: "",
    existingDisease: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [validationErrors, setValidationErrors] = useState({});
  const [verificationId, setVerificationId] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Initialize reCAPTCHA verifier
  const setupRecaptcha = () => {
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
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.age) {
      errors.age = "Age is required";
    } else if (formData.age < 0 || formData.age > 120) {
      errors.age = "Please enter a valid age";
    }

    if (registrationMethod === 'email') {
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    } else {
      if (!formData.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
      } else {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
          errors.phoneNumber = "Please enter a valid phone number with country code (e.g., +1234567890)";
        }
      }
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handlePhoneRegistration = async () => {
    try {
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const phoneProvider = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      const confirmationResult = await signInWithPhoneNumber(auth, formData.phoneNumber, phoneProvider);
      setVerificationId(confirmationResult.verificationId);
      setShowVerificationInput(true);
      toast.success("Verification code sent to your phone!");
    } catch (error) {
      console.error("Phone registration error:", error);
      setError(mapFirebaseError(error.code));
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await testFirebaseConnection();
      
      let user;
      
      if (registrationMethod === 'email') {
        console.log("Attempting registration with email:", formData.email);
        
        // Validate email format before attempting registration
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          throw new Error("Invalid email format");
        }

        // Validate password strength
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        user = userCredential.user;

        if (!user) {
          throw new Error("No user data received after registration");
        }

        console.log("User created successfully:", user.uid);

        try {
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${user.uid}&size=150x150`;

          // Create user document in Firestore
          const userData = {
            name: formData.name,
            age: formData.age,
            email: formData.email,
            phoneNumber: formData.phoneNumber || null,
            location: formData.location,
            existingDisease: formData.existingDisease || null,
            qrCode: qrCodeUrl,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            uid: user.uid
          };

          await setDoc(doc(db, "users", user.uid), userData);
          console.log("User data stored in Firestore:", userData);

          toast.success("Registration successful! Please login.");
          navigate("/login");
        } catch (firestoreError) {
          console.error("Firestore Error:", firestoreError);
          // If Firestore fails but auth succeeded, we should still let the user know they can login
          toast.warning("Account created but profile data could not be saved. Please update your profile after logging in.");
          navigate("/login");
        }
      } else {
        // Phone registration
        await handlePhoneRegistration();
        return;
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage = mapFirebaseError(err.code) || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const mapFirebaseError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please use a different email or try logging in.";
      case "auth/invalid-email":
        return "Invalid email format. Please enter a valid email.";
      case "auth/operation-not-allowed":
        return "Registration is currently disabled. Please try again later.";
      case "auth/weak-password":
        return "Password is too weak. Please use a stronger password (at least 6 characters).";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again.";
      case "auth/internal-error":
        return "An internal error occurred. Please check your input and try again.";
      case "auth/invalid-phone-number":
        return "The phone number is invalid. Please enter a valid phone number.";
      case "auth/invalid-verification-code":
        return "Invalid verification code. Please try again.";
      case "auth/code-expired":
        return "The verification code has expired. Please request a new one.";
      default:
        return `Registration failed: ${code || 'Unknown error'}`;
    }
  };

  const toggleRegistrationMethod = () => {
    setRegistrationMethod(prev => prev === 'email' ? 'phone' : 'email');
    setError("");
    setShowVerificationInput(false);
    setVerificationId("");
    setVerificationCode("");
    setFormData(prev => ({
      ...prev,
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    }));
    setValidationErrors({});
  };

  return (
    <PageContainer darkMode={darkMode}>
      <ContentContainer>
        <Card darkMode={darkMode}>
          <h2 style={{ color: darkMode ? '#fff' : '#333', marginBottom: '1.5rem' }}>Register Now</h2>
          <p style={{ color: darkMode ? '#cccccc' : '#666666', marginBottom: '2rem' }}>
            Create your account to securely store and manage your health records
            anytime, anywhere, even offline.
          </p>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <button
              onClick={toggleRegistrationMethod}
              style={{
                ...buttonStyle(darkMode),
                backgroundColor: 'transparent',
                border: `1px solid ${darkMode ? '#fff' : '#333'}`,
                padding: '0.5rem 1rem',
                marginBottom: '1rem'
              }}
            >
              Switch to {registrationMethod === 'email' ? 'Phone' : 'Email'} Registration
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Name</label>
              <input
                name="name"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.name}
                style={{
                  ...inputStyle(darkMode),
                  borderColor: validationErrors.name ? '#dc3545' : undefined
                }}
                disabled={loading}
                required
              />
              {validationErrors.name && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {validationErrors.name}
                </div>
              )}
          </div>

            <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle(darkMode)}>Age</label>
            <input
              name="age"
              type="number"
              placeholder="Enter your age"
              onChange={handleChange}
              value={formData.age}
              style={{
                ...inputStyle(darkMode),
                borderColor: validationErrors.age ? '#dc3545' : undefined
              }}
              disabled={loading}
              required
            />
            {validationErrors.age && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validationErrors.age}
              </div>
            )}
          </div>

          {registrationMethod === 'email' ? (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={formData.email}
                style={{
                  ...inputStyle(darkMode),
                  borderColor: validationErrors.email ? '#dc3545' : undefined
                }}
                disabled={loading}
                required
              />
              {validationErrors.email && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {validationErrors.email}
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Phone Number</label>
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number with country code (+1234567890)"
                onChange={handleChange}
                value={formData.phoneNumber}
                style={{
                  ...inputStyle(darkMode),
                  borderColor: validationErrors.phoneNumber ? '#dc3545' : undefined
                }}
                disabled={loading}
                required
              />
              {validationErrors.phoneNumber && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {validationErrors.phoneNumber}
                </div>
              )}
            </div>
          )}

            <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle(darkMode)}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              style={{
                ...inputStyle(darkMode),
                borderColor: validationErrors.password ? '#dc3545' : undefined
              }}
              disabled={loading}
              required
            />
            {validationErrors.password && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validationErrors.password}
              </div>
            )}
          </div>

            <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle(darkMode)}>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={handleChange}
              value={formData.confirmPassword}
              style={{
                ...inputStyle(darkMode),
                borderColor: validationErrors.confirmPassword ? '#dc3545' : undefined
              }}
              disabled={loading}
              required
            />
            {validationErrors.confirmPassword && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validationErrors.confirmPassword}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Location</label>
              <input
                name="location"
                placeholder="Enter your location"
                onChange={handleChange}
                value={formData.location}
                style={{
                  ...inputStyle(darkMode),
                  borderColor: validationErrors.location ? '#dc3545' : undefined
                }}
                disabled={loading}
                required
              />
            {validationErrors.location && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validationErrors.location}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle(darkMode)}>Existing Disease (Optional)</label>
            <input
              name="existingDisease"
              placeholder="Enter any existing disease"
              onChange={handleChange}
              value={formData.existingDisease}
              style={inputStyle(darkMode)}
              disabled={loading}
            />
          </div>

          {registrationMethod === 'phone' && (
            <div id="recaptcha-container" style={{ marginBottom: '1rem' }}></div>
          )}

          {showVerificationInput && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Verification Code</label>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={inputStyle(darkMode)}
                required
              />
            </div>
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
            {loading ? "Registering..." : "Register"}
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
            textAlign: 'center',
            color: darkMode ? '#aaa' : '#666'
          }}>
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ 
                color: darkMode ? '#66b3ff' : '#0077cc',
                textDecoration: 'none',
                ':hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Login here
            </Link>
          </div>
        </Card>
      </ContentContainer>
    </PageContainer>
  );
};

export default Register;
