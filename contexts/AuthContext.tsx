import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../constants/firebase';
import { authAPI } from '../services/api';

interface AuthContextType {
    user: any | null;
    loading: boolean;
    isAuthenticated: boolean;
    manualAuthActive: boolean;
    setManualAuthActive: (active: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    manualAuthActive: false,
    setManualAuthActive: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [manualAuthActive, setManualAuthActive] = useState(false);

    useEffect(() => {
        let unsubscribeFirebase: (() => void) | undefined;

        const initAuth = async () => {
            const token = await AsyncStorage.getItem('serbisure_token');
            if (token) {
                try {
                    const djangoData = await authAPI.getProfile();
                    const djangoUser = djangoData.data || djangoData;
                    if (djangoUser && djangoUser.email) {
                        setUser({
                            uid: djangoUser.id,
                            email: djangoUser.email,
                            full_name: djangoUser.full_name,
                            role: djangoUser.role === 'service_worker' ? 'worker' : 'homeowner',
                        });
                        setLoading(false);
                        return; // Found Django session
                    }
                } catch (err) {
                    console.warn("Django session restoration failed:", err);
                    await AsyncStorage.removeItem('serbisure_token');
                }
            }

            unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    try {
                        const docRef = doc(db, "users", firebaseUser.uid);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            const profileData = docSnap.data();
                            setUser({
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                ...profileData
                            });
                        } else {
                            setUser({
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                role: 'homeowner'
                            });
                        }
                    } catch (err) {
                        console.warn("Firestore profile fetch failed (likely permission issues):", err);
                        // Fallback to basic info if DB is locked
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: 'homeowner'
                        });
                    }
                } else {
                    setUser(null);
                }
                setLoading(false);
            });
        };

        initAuth();

        return () => {
            if (unsubscribeFirebase) unsubscribeFirebase();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, manualAuthActive, setManualAuthActive }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
