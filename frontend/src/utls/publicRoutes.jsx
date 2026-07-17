import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
    const { clientToken, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (clientToken && (location.pathname === "/login" || location.pathname === "/register")) {
            window.history.replaceState(null, "", "/dashboard");
        }
    }, [clientToken, location.pathname]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (clientToken) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}