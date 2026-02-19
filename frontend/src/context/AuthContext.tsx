"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Define the User type based on backend response
interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    picture_url?: string; // Backend uses picture_url
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void; // Redirects to Google
    logout: () => void;
    verifyToken: (token: string) => Promise<boolean>; // Exposed for AuthTokenListener
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL from env or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sortmail-production.up.railway.app";

// --- Helper Component for URL Token Handling ---
function AuthTokenHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { verifyToken } = useAuth();
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        const urlToken = searchParams?.get("token");

        if (urlToken && !processed) {
            console.log("🔗 Token found in URL via Handler, authenticating...");
            setProcessed(true); // Prevent double firing

            // Save immediately
            localStorage.setItem("sortmail_token", urlToken);

            verifyToken(urlToken).then((success) => {
                if (success) {
                    console.log("✅ OAuth Login Success (Handler)");
                    router.replace("/dashboard");
                }
            });
        }
    }, [searchParams, verifyToken, router, processed]);

    return null; // This component handles logic only
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch user from backend using token
    const verifyToken = async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                return true;
            } else {
                console.error("Failed to fetch user", res.status);
                localStorage.removeItem("sortmail_token");
                return false;
            }
        } catch (error) {
            console.error("Auth fetch error", error);
            localStorage.removeItem("sortmail_token");
            return false;
        }
    };

    // Initial Session Check
    useEffect(() => {
        const initSession = async () => {
            const storedToken = localStorage.getItem("sortmail_token");
            if (storedToken) {
                await verifyToken(storedToken);
            }
            setIsLoading(false);
        };
        initSession();
    }, []);

    // Redirect to Backend OAuth endpoint
    const login = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    };

    const logout = () => {
        localStorage.removeItem("sortmail_token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, verifyToken }}>
            <Suspense fallback={null}>
                <AuthTokenHandler />
            </Suspense>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
