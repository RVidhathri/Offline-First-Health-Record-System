import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
if (!window.firebase.apps.length) {
  window.firebase.initializeApp(firebaseConfig);
}

// Create a wrapper component for global styles
const GlobalStyles = () => {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <GlobalStyles />
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);


