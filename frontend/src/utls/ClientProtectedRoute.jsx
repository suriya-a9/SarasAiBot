import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ClientProtectedRoute({ children }) {
    const { clientToken } = useAuth();

    if (!clientToken) return <Navigate to="/login" replace />;

    return children;
}