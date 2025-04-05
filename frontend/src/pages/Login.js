import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/profile");
    } catch (err) {
      const errorMessage = mapFirebaseError(err.code);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      default:
        return "Login failed. Please check your credentials.";
    }
  };

  return (
<div style={formPageWrapper(darkMode)}>

    <div style={loginContainerStyle(darkMode)}>
  <h2>Login</h2>
  <form onSubmit={handleLogin}>
    <label style={labelStyle(darkMode)}>Email</label>
    <input
      type="email"
      placeholder="Enter your email"
      onChange={(e) => setEmail(e.target.value)}
      style={inputStyle(darkMode)}
      required
    />
    <label style={labelStyle(darkMode)}>Password</label>
    <input
      type="password"
      placeholder="Enter your password"
      onChange={(e) => setPassword(e.target.value)}
      style={inputStyle(darkMode)}
      required
    />
    <button type="submit" style={buttonStyle(darkMode)} disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </form>
  <p style={{ marginTop: "10px" }}>
    Forgot your password?{" "}
    <Link to="/reset-password" style={{ color: "#0077cc" }}>
      Reset here
    </Link>
  </p>
  </div>
</div>

  );
};

export default Login;
