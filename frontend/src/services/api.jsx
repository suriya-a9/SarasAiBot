import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:8080/api",
    baseURL: "https://sarasaibot-6oq5.onrender.com/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("clientToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            (error.response.data?.message === "Account Deleted" || error.response.data?.message === "Account Disabled")
        ) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;