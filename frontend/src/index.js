import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
// Add this to inject global keyframes into the DOM if no index.css
useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = globalAnimationCSS;
  document.head.appendChild(style);
}, []);


