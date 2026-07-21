import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute({ children }) {
    const { token } = useAuth();

    if (!token) return <Navigate to="/admin-login" replace />;

    return children;
}