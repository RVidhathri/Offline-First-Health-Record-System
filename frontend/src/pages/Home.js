import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../style"; // 🛠 Correct import (named export)
import { useTheme } from "../ThemeContext"; // 🛠 Import ThemeContext

function Home() {
  const { darkMode } = useTheme(); // 🛠 Get darkMode state
  const s = styles(darkMode); // 🛠 Get styles based on darkMode
  const fadeInStyle = {
    animation: "fadeIn 1.5s ease-in-out",
  };
  
  return (
    <div style={s.homeBackground}>
      <div style={{
        backgroundColor: "#ffffffcc",
        borderRadius: "15px",
        padding: "3rem",
        maxWidth: "750px",
        textAlign: "center",
        boxShadow: darkMode ? "0 0 15px #000" : "0 0 10px #ccc"
      }}>
        <h1 style={{ ...s.heading, ...fadeInStyle }}>
  Your Health Records,<br />Anytime, Anywhere
</h1>

        <p style={s.subText}>
          Securely store and manage your health records offline and online,<br />
          seamlessly for everyone.
        </p>
        <div style={s.buttonGroup}>
          <Link to="/register">
            <button style={s.button}>Register</button>
          </Link>
          <Link to="/login">
            <button style={s.button}>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
