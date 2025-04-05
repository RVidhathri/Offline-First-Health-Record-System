import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginContainerStyle,
  inputStyle,
  buttonStyle,
  labelStyle,
} from "../style";
import { useTheme } from "../ThemeContext"; // ✅ import useTheme

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // ✅ get darkMode value

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to send reset email. Try again.");
    }
  };

  return (
    <div style={loginContainerStyle(darkMode)}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <label style={labelStyle(darkMode)}>Enter your email</label>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle(darkMode)}
          required
        />
        <button type="submit" style={buttonStyle(darkMode)}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
