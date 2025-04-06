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
    '@media (max-width: 768px)': {
      height: "auto",
      minHeight: "100vh",
      padding: "2rem 0"
    }
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "2rem",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff",
    maxWidth: "700px",
    '@media (max-width: 768px)': {
      padding: "1.5rem",
      margin: "1rem",
      width: "90%"
    }
  },

  heroHeading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    '@media (max-width: 768px)': {
      fontSize: "2rem"
    }
  },

  heroSubText: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    '@media (max-width: 768px)': {
      fontSize: "1rem"
    }
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
    '@media (max-width: 768px)': {
      padding: "1rem",
      flexDirection: "column",
      gap: "1rem"
    }
  },

  navLeft: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    '@media (max-width: 768px)': {
      fontSize: "1.2rem"
    }
  },

  ul: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
    alignItems: "center",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      width: "100%",
      gap: "0.5rem"
    }
  },

  li: {
    display: "inline",
    '@media (max-width: 768px)': {
      width: "100%"
    }
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    '@media (max-width: 768px)': {
      display: "block",
      padding: "0.75rem",
      textAlign: "center",
      width: "100%"
    }
  },

  logoutButton: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    '@media (max-width: 768px)': {
      width: "100%",
      padding: "0.75rem",
      textAlign: "center"
    }
  },

  toggleButton: {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    '@media (max-width: 768px)': {
      width: "100%",
      padding: "0.75rem"
    }
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
    '@media (max-width: 768px)': {
      padding: "1rem",
      minHeight: "calc(100vh - 60px)"
    }
  },

  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "1rem 0",
    color: darkMode ? "#ffffff" : "#000000",
    '@media (max-width: 768px)': {
      fontSize: "1.8rem"
    }
  },

  subText: {
    fontSize: "18px",
    color: darkMode ? "#ddd" : "#333",
    marginBottom: "20px",
    '@media (max-width: 768px)': {
      fontSize: "16px"
    }
  },

  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "center",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      width: "100%"
    }
  },

  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    '@media (max-width: 768px)': {
      width: "100%",
      padding: "12px"
    },
    ':hover': {
      backgroundColor: "#0056b3"
    }
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
    '@media (max-width: 768px)': {
      padding: "1rem"
    }
  },

  logo: {
    width: "200px",
    marginBottom: "1rem",
    '@media (max-width: 768px)': {
      width: "150px"
    }
  },

  tableStyle: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  },

  thStyle: {
    backgroundColor: darkMode ? '#1e1e1e' : '#007bff',
    color: '#ffffff',
    padding: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: darkMode ? '#2d2d2d' : '#0056b3'
    }
  },

  tdStyle: {
    padding: '12px',
    borderBottom: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    color: darkMode ? '#ffffff' : '#000000'
  }
});

export const containerStyle = (darkMode) => ({
  maxWidth: "500px",
  margin: "4rem auto",
  padding: "2rem",
  backgroundColor: darkMode ? "#1e1e1e" : "#add8e6",
  color: darkMode ? "white" : "black",
  borderRadius: "15px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  fontFamily: "Arial, sans-serif",
  '@media (max-width: 768px)': {
    margin: "2rem auto",
    padding: "1.5rem",
    width: "90%"
  }
});

export const titleStyle = (darkMode) => ({
  textAlign: "center",
  fontSize: "1.8rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: darkMode ? "#ffffff" : "#000000",
  '@media (max-width: 768px)': {
    fontSize: "1.5rem"
  }
});

export const descriptionStyle = (darkMode) => ({
  fontSize: "14px",
  marginBottom: "20px",
  color: darkMode ? "#ccc" : "#333",
  '@media (max-width: 768px)': {
    fontSize: "13px"
  }
});

export const labelStyle = (darkMode) => ({
  fontWeight: "bold",
  marginBottom: "0.3rem",
  display: "block",
  '@media (max-width: 768px)': {
    fontSize: "0.9rem"
  }
});

export const inputStyle = (darkMode) => ({
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  '@media (max-width: 768px)': {
    padding: "12px",
    fontSize: "16px"
  }
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
  '@media (max-width: 768px)': {
    padding: "14px",
    fontSize: "16px"
  },
  ':hover': {
    backgroundColor: "#0056b3"
  }
});

export const loginContainerStyle = (darkMode) => ({
  backgroundColor: "#add8e6",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "500px",
  margin: "2rem auto",
  '@media (max-width: 768px)': {
    padding: "1.5rem",
    margin: "1rem auto",
    width: "90%"
  }
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
  '@media (max-width: 768px)': {
    padding: "1rem"
  }
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
  '@media (max-width: 768px)': {
    padding: "1.5rem",
    width: "90%",
    margin: "1rem auto"
  }
});

  
  
  
