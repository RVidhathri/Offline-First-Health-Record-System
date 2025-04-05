// style.js

export const styles = (darkMode) => ({
  heroSection: {
    backgroundImage: `url("/background.jpeg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "2rem",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff",
    maxWidth: "700px",
  },

  heroHeading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },

  heroSubText: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },

  app: {
    minHeight: "100vh",
    backgroundColor: darkMode ? "#121212" : "#f5f5f5",
    color: darkMode ? "#ffffff" : "#000000",
    transition: "all 0.3s ease",
  },

  nav: {
    backgroundColor: darkMode ? "#1e1e1e" : "#007bff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navLeft: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
  },

  ul: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },

  li: {
    display: "inline",
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
  },

  logoutButton: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  toggleButton: {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },

  homeBackground: {
    backgroundImage: 'url("/background.jpeg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },

  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "1rem 0",
    color: darkMode ? "#ffffff" : "#000000",
  },

  subText: {
    fontSize: "18px",
    color: darkMode ? "#ddd" : "#333",
    marginBottom: "20px",
  },

  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    backgroundColor: darkMode ? "#121212" : "#f5f5f5",
    color: darkMode ? "#ffffff" : "#000000",
    minHeight: "100vh",
    transition: "all 0.3s ease",
    textAlign: "center",
  },

  logo: {
    width: "200px",
    marginBottom: "1rem",
  },
});

// Export form styles separately (not inside the `styles` function)
export const containerStyle = (darkMode) => ({
  maxWidth: "500px",
  margin: "4rem auto",
  padding: "2rem",
  backgroundColor: darkMode ? "#1e1e1e" : "#add8e6",
  color: darkMode ? "white" : "black",
  borderRadius: "15px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  fontFamily: "Arial, sans-serif"
});


export const titleStyle = (darkMode) => ({
  textAlign: "center",
  fontSize: "1.8rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: darkMode ? "#ffffff" : "#000000" // ✨ optional
});

export const descriptionStyle = (darkMode) => ({
  fontSize: "14px",
  marginBottom: "20px",
  color: darkMode ? "#ccc" : "#333",
});

export const labelStyle = (darkMode) => ({
  fontWeight: "bold",
  marginBottom: "0.3rem",
  display: "block"
});

export const inputStyle = (darkMode) => ({
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem"
});

export const buttonStyle = (darkMode) => ({
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  width: "100%",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  boxShadow: darkMode ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
});

  export const loginContainerStyle = (darkMode) => ({
    backgroundColor: "#add8e6", // light blue
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    margin: "2rem auto",
  });
 
  export const formPageWrapper = (darkMode) => ({
    backgroundImage: 'url("/background.jpeg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: darkMode ? "#121212" : "#ffffff",
  });
  export const fadeIn = {
    animation: "fadeIn 0.8s ease-in-out",
  };
  
  export const globalAnimations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  export const overlayCard = (darkMode) => ({
    backgroundColor: darkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.8)",
    padding: "2rem",
    borderRadius: "15px",
    backdropFilter: "blur(5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  });
  
  
  
  
