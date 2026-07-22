import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("clientToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const message = error.response.data?.message || "";
            const isClientAuthFailure = [
                "Account Deleted",
                "Account Disabled",
                "Your account is inactive. Please contact the administrator.",
            ].some((text) => message === text || message.includes("inactive"));

            const requestUrl = error.config?.url || "";
            const isAuthEntryPoint = requestUrl.includes("/clientAuth/login") || requestUrl.includes("/clientAuth/register");

            if (isClientAuthFailure && !isAuthEntryPoint) {
                localStorage.removeItem("clientToken");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;