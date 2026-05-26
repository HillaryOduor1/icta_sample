import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    
    const isMasterRoute = location.pathname.startsWith('/master');

    useEffect(() => {
        const endpoint = isMasterRoute ? '/api/v1/auth/master/me' : '/api/v1/auth/me';
        
        fetch(endpoint, {
            credentials: "include",
            headers: { "Cache-Control": "no-cache" }
        })
        .then(res => {
            if (!res.ok) throw new Error('Not authenticated');
            return res.json();
        })
        .then(data => {
            const userData = data.data || data;
            setUserRole(userData.role?.toLowerCase());
            setIsAuthenticated(true);
            setLoading(false);
        })
        .catch(err => {
            console.error("Auth error:", err);
            setIsAuthenticated(false);
            setLoading(false);
        });
    }, [isMasterRoute]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(userRole)) {
        console.log("Access denied. Role:", userRole, "Required:", roles);
        return <Navigate to="/unauthorized" replace />;
    }
    
    return children;
}
