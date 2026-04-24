"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface User {
    id: number;
    phoneNumber: string;
    role: "admin" | "user";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAdmin: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = Cookies.get("token");
        const savedUser = Cookies.get("user");
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch { }
        }
        setLoading(false);
    }, []);

    const login = (t: string, u: User) => {
        Cookies.set("token", t, { expires: 1 });
        Cookies.set("user", JSON.stringify(u), { expires: 1 });
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, isAdmin: user?.role === "admin", login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
