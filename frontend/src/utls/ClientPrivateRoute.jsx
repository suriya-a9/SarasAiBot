import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function ClientPrivateRoute({ children }) {
    const { clientToken, loading, logout } = useAuth();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function verify() {
            if (loading) return;

            if (!clientToken) {
                if (mounted) {
                    setAllowed(false);
                    setChecking(false);
                }
                return;
            }

            try {
                const base = import.meta.env.VITE_API_BASE_URL || "";
                const res = await fetch(`${base}/api/clientAuth/profile`, {
                    headers: { Authorization: `Bearer ${clientToken}` },
                });

                if (!mounted) return;

                if (res.status === 200) {
                    setAllowed(true);
                } else if (res.status === 401 || res.status === 403) {
                    try {
                        logout();
                    } catch (e) {
                        localStorage.removeItem("clientToken");
                    }
                    setAllowed(false);
                } else {
                    setAllowed(false);
                }
            } catch (err) {
                setAllowed(true);
            } finally {
                if (mounted) setChecking(false);
            }
        }

        verify();

        return () => {
            mounted = false;
        };
    }, [clientToken, loading, logout]);

    if (loading || checking) return <div>Loading...</div>;

    if (!clientToken || !allowed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}