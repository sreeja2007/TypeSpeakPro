import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { googleTokenPayloadSchema, normalizeError } from '@/lib/validation';

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

/**
 * Checks if a JWT token's `exp` claim has passed.
 * Returns true if the token is expired or if exp is missing.
 */
function isTokenExpired(exp: number | undefined): boolean {
    if (exp === undefined || exp === null) return true;
    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= exp * 1000;
}

/**
 * Safely decodes and validates a Google JWT token.
 * Returns the validated payload or null if invalid/expired.
 */
function decodeAndValidateToken(token: string): { name: string; email: string; picture: string; sub: string } | null {
    try {
        const decoded: unknown = jwtDecode(token);
        const result = googleTokenPayloadSchema.safeParse(decoded);

        if (!result.success) {
            console.error("Token validation failed:", result.error.issues);
            return null;
        }

        if (isTokenExpired(result.data.exp)) {
            console.warn("Token has expired. Clearing session.");
            return null;
        }

        return {
            name: result.data.name,
            email: result.data.email,
            picture: result.data.picture,
            sub: result.data.sub,
        };
    } catch (error) {
        const normalized = normalizeError(error, "Failed to decode authentication token.");
        console.error("Token decode error:", normalized.message);
        return null;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    // Helper to fetch Supabase ID
    const fetchSupabaseUser = async (email: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();
            if (error) throw error;
            return data?.id;
        } catch (error) {
            console.error("Error fetching user from Supabase:", error);
            return null;
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('google_token');
            if (token) {
                const userData = decodeAndValidateToken(token);
                if (!userData) {
                    // Token is invalid or expired — clean up
                    localStorage.removeItem('google_token');
                    setIsLoading(false);
                    return;
                }

                setUser(userData);

                // Then fetch the real DB ID
                const id = await fetchSupabaseUser(userData.email);
                console.log("Supabase ID fetched for auto-login:", id);
                if (id) {
                    setUser(prev => prev ? { ...prev, id } : null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (token: string) => {
        try {
            const userData = decodeAndValidateToken(token);
            if (!userData) {
                toast.error("Invalid login token. Please try again.");
                return;
            }

            // Optimistic update
            setUser(userData);
            localStorage.setItem('google_token', token);

            toast.success("Successfully logged in!");
            closeLoginModal(); // Close modal on successful login

            // Sync with Supabase (Background)
            try {
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

                if (error) throw error;

                if (data) {
                    console.log("User synced! Got ID:", data.id);
                    // Update state with the real ID from DB
                    setUser(prev => prev ? { ...prev, id: data.id } : null);
                }
            } catch (dbError) {
                console.error("Database sync failed (non-fatal):", dbError);
                // We don't block login if DB fails, but user won't have ID for saving results
            }

        } catch (error) {
            const normalized = normalizeError(error, "Login failed.");
            console.error("Login failed:", normalized.message);
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
