import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface User {
    id?: string; // Add ID from database
    name: string;
    email: string;
    picture: string;
    sub: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    // Helper to fetch Supabase ID
    const fetchSupabaseUser = async (email: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        return data?.id;
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('google_token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    // Initial load from token
                    const initialUser = {
                        name: decoded.name,
                        email: decoded.email,
                        picture: decoded.picture,
                        sub: decoded.sub,
                    };
                    setUser(initialUser);

                    // Then fetch the real DB ID
                    const id = await fetchSupabaseUser(decoded.email);
                    console.log("Supabase ID fetched for auto-login:", id);
                    if (id) {
                        setUser(prev => prev ? { ...prev, id } : null);
                    } else {
                        console.warn("No Supabase ID found for user:", decoded.email);
                    }
                } catch (error) {
                    console.error("Invalid token found", error);
                    localStorage.removeItem('google_token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const userData = {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                sub: decoded.sub,
            };

            // Optimistic update
            setUser(userData);
            localStorage.setItem('google_token', token);

            // Sync with Supabase
            console.log("Syncing user with Supabase...", userData.email);
            const { data, error } = await supabase
                .from('users')
                .upsert({
                    email: userData.email,
                    name: userData.name,
                    picture: userData.picture,
                    google_sub: userData.sub,
                }, { onConflict: 'email' })
                .select()
                .single();

            if (error) {
                console.error("Error syncing user to Supabase:", error);
            } else if (data) {
                console.log("User synced! Got ID:", data.id);
                // Update state with the real ID from DB
                setUser({ ...userData, id: data.id });
            }

            toast.success("Successfully logged in!");
            closeLoginModal(); // Close modal on successful login
        } catch (error) {
            console.error("Login failed", error);
            toast.error("Failed to login. Please try again.");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('google_token');
        toast.info("Logged out successfully.");
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
