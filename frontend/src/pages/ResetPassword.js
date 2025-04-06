import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { styles } from "../style";
import { useTheme } from "../ThemeContext";
import { Link } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { darkMode } = useTheme();
    const currentStyles = styles(darkMode);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset link sent to your email!");
            setEmail("");
        } catch (error) {
            console.error("Error sending reset email:", error);
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.5s ease-in-out'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '2rem',
                animation: 'slideInDown 0.5s ease-out'
            }}>
                <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '1rem' }} />
                <h1 style={{
                    color: darkMode ? '#fff' : '#333',
                    fontSize: '1.5rem',
                    margin: 0
                }}>Offline-First Health Record System</h1>
            </div>

            <div style={{
                backgroundColor: darkMode ? 'rgba(33, 33, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                padding: '2rem',
                borderRadius: '15px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.5s ease-out'
            }}>
                <h2 style={{
                    color: darkMode ? '#fff' : '#333',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>Reset Password</h2>

                <p style={{
                    color: darkMode ? '#aaa' : '#666',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            style={{
                                ...currentStyles.input,
                                width: '100%',
                                padding: '0.8rem',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...currentStyles.button,
                            width: '100%',
                            backgroundColor: '#007bff',
                            marginBottom: '1rem',
                            position: 'relative',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '1rem'
                    }}>
                        <Link
                            to="/login"
                            style={{
                                color: darkMode ? '#4a9eff' : '#0056b3',
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideIn {
                        from {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideInDown {
                        from {
                            transform: translateY(-20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default ResetPassword;
