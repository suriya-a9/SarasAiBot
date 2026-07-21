import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AdminAuthContext";

export default function AdminPublicRoute({ children }) {
    const { token, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (token && (location.pathname === "/admin-login")) {
            window.history.replaceState(null, "", "/admin-dashboard");
        }
    }, [token, location.pathname]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (token) {
        return <Navigate to="/admin-dashboard" replace />;
    }

    return children;
}