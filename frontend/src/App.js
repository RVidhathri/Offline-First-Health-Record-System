import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styles as getStyles } from "./style";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Records from "./pages/Records";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword"; // Adjust path if necessary

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const styles = getStyles(darkMode); // use dark/light mode styles

  return (
    <div style={styles.app}>
      <Router>
      <nav style={styles.nav}>
      <img src="/logo.png" alt="Logo" style={{ height: "40px" }} />

  <ul style={styles.ul}>
    <li style={styles.li}><Link to="/" style={styles.link}>Home</Link></li>
    <li style={styles.li}><Link to="/register" style={styles.link}>Register</Link></li>
    <li style={styles.li}><Link to="/login" style={styles.link}>Login</Link></li>
    <li style={styles.li}><Link to="/records" style={styles.link}>Records</Link></li>
    {currentUser && (
      <>
        <li style={styles.li}><Link to="/profile" style={styles.link}>Profile</Link></li>
        <li style={styles.li}>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </li>
      </>
    )}
    <li style={styles.li}>
      <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </li>
  </ul>
</nav>


        <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/records" element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </div>
  );
}

export default App;
