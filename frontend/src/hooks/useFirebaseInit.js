import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

export function useFirebaseInit() {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Wait for Firebase Auth to initialize
        const unsubscribe = auth.onAuthStateChanged(() => {
            if (!initialized) {
                setInitialized(true);
            }
        }, (error) => {
            console.error('Firebase Auth error:', error);
            setInitialized(true); // Still set initialized to prevent infinite loading
        });

        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (!initialized) {
                console.warn('Firebase Auth initialization timeout');
                setInitialized(true);
            }
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [initialized]);

    return initialized;
} 