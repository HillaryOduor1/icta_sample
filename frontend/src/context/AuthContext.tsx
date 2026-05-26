import * as React from "react";
import { useNavigate } from "react-router-dom";

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => boolean;
    loginWithGoogle: () => boolean;
    logout: () => void;
    forgotPassword: (email: string) => boolean;
    resetPassword: (email: string, token: string, newPassword: string) => boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
        return localStorage.getItem("admin_auth") === "true";
    });
    const [user, setUser] = React.useState<User | null>(() => {
        const storedUser = localStorage.getItem("admin_user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (username: string, password: string) => {
        // Simple authentication logic for demonstration
        if (username === "admin" && password === "admin123") {
            const userData = { username: "admin", email: "admin@example.com" };
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem("admin_auth", "true");
            localStorage.setItem("admin_user", JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const loginWithGoogle = () => {
        // Mock Google Login
        const userData = { username: "google_user", email: "user@gmail.com" };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_user", JSON.stringify(userData));
        return true;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_user");
        navigate("/login");
    };

    const forgotPassword = (email: string) => {
        console.log(`Password reset email sent to: ${email}`);
        return true; // Mock success
    };

    const resetPassword = (email: string, token: string, newPassword: string) => {
        console.log(`Password reset for ${email} with token ${token} to new password: ${newPassword}`);
        return true; // Mock success
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, loginWithGoogle, logout, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
