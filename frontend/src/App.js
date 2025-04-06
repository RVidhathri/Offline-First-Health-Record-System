import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from 'styled-components';
import { useTheme } from "./ThemeContext";
import { useFirebaseInit } from './hooks/useFirebaseInit';

// Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Records from "./pages/Records";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import PublicRecord from "./pages/PublicRecord";
import PrivateRoute from "./components/PrivateRoute";

const AppContainer = styled.div`
    min-height: 100vh;
    background-image: url('/background.jpeg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)'};
    backdrop-filter: blur(8px);
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
`;

const StyledToastContainer = styled(ToastContainer)`
    .Toastify__toast {
        background-color: ${props => props.darkMode ? '#333' : '#fff'};
        color: ${props => props.darkMode ? '#fff' : '#333'};
    }
    .Toastify__close-button {
        color: ${props => props.darkMode ? '#fff' : '#333'};
    }
    .Toastify__progress-bar {
        background-color: ${props => props.darkMode ? '#fff' : '#007bff'};
    }
`;

function App() {
    const { darkMode } = useTheme();
    const initialized = useFirebaseInit();

    if (!initialized) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: darkMode ? '#121212' : '#f5f7fa'
            }}>
                <div style={{
                    color: darkMode ? '#fff' : '#333',
                    fontSize: '1.2rem'
                }}>Loading...</div>
            </div>
        );
    }

    return (
        <AppContainer>
            <Overlay darkMode={darkMode} />
            <ContentWrapper>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute>} />
                    <Route path="/public-record/:id" element={<PublicRecord />} />
                </Routes>
                <StyledToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={darkMode ? 'dark' : 'light'}
                />
            </ContentWrapper>
        </AppContainer>
    );
}

export default App;
