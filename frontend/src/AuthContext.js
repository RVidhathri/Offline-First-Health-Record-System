import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const defaultAuthState = {
    currentUser: null,
    userData: null,
    loading: true,
    logout: async () => {},
    isAuthenticated: false,
    refreshUserData: async () => {}
};

const AuthContext = createContext(defaultAuthState);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        console.warn("useAuth must be used within an AuthProvider");
        return defaultAuthState;
    }
    return context;
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUserData = async (user) => {
        if (!user) {
            setUserData(null);
            return;
        }

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                console.warn("No user data found in Firestore");
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Error loading user data. Please try refreshing the page.");
        }
    };

    const refreshUserData = async () => {
        if (currentUser) {
            await fetchUserData(currentUser);
        }
    };

    useEffect(() => {
        console.log("Setting up auth state listener");
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed:", user ? "User logged in" : "No user");
            
            setCurrentUser(user);
            setIsAuthenticated(!!user);
            
            if (user) {
                await fetchUserData(user);
            } else {
                setUserData(null);
            }
            
            setLoading(false);
        }, (error) => {
            console.error("Auth state change error:", error);
            setLoading(false);
            toast.error("Authentication error. Please try logging in again.");
        });

        return () => {
            console.log("Cleaning up auth state listener");
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            setCurrentUser(null);
            setUserData(null);
            setIsAuthenticated(false);
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Failed to log out. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        userData,
        loading,
        logout,
        isAuthenticated,
        refreshUserData
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f7fa'
            }}>
                <div style={{
                    padding: '2rem',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 