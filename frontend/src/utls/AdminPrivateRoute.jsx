import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AdminAuthContext";

export default function AdminPrivateRoute({ children }) {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
}