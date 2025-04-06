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
        padding: window.innerWidth <= 768 ? "1.5rem" : "3rem",
        maxWidth: "750px",
        width: "90%",
        textAlign: "center",
        boxShadow: darkMode ? "0 0 15px #000" : "0 0 10px #ccc",
        margin: "1rem auto"
      }}>
        <h1 style={{ 
          ...s.heading, 
          ...fadeInStyle,
          fontSize: window.innerWidth <= 768 ? "1.8rem" : "2.5rem",
          lineHeight: "1.3"
        }}>
          Your Health Records,<br />Anytime, Anywhere
        </h1>

        <p style={{
          ...s.subText,
          fontSize: window.innerWidth <= 768 ? "1rem" : "1.125rem",
          lineHeight: "1.5",
          margin: "1.5rem 0"
        }}>
          Securely store and manage your health records offline and online
          seamlessly .
        </p>
        <div style={{
          ...s.buttonGroup,
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          gap: window.innerWidth <= 768 ? "1rem" : "1.5rem"
        }}>
          <Link to="/register" style={{ width: window.innerWidth <= 768 ? "100%" : "auto" }}>
            <button style={{
              ...s.button,
              width: window.innerWidth <= 768 ? "100%" : "auto",
              padding: window.innerWidth <= 768 ? "12px" : "10px 20px"
            }}>
              Register
            </button>
          </Link>
          <Link to="/login" style={{ width: window.innerWidth <= 768 ? "100%" : "auto" }}>
            <button style={{
              ...s.button,
              width: window.innerWidth <= 768 ? "100%" : "auto",
              padding: window.innerWidth <= 768 ? "12px" : "10px 20px"
            }}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
