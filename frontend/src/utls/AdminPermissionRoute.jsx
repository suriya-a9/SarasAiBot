import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AdminAuthContext";

export default function AdminPermissionRoute({ permission, children }) {
    const { permissions } = useAuth();
    if (!permissions.includes(permission)) {
        return <Navigate to="/admin-login" replace />;
    }
    return children;
}